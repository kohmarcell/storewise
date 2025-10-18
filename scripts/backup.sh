#!/bin/bash

# StoreWise Database Backup Script
# This script creates automated backups of the PostgreSQL database

set -e

# Configuration
DB_HOST="postgres"
DB_PORT="5432"
DB_USER="storewise"
DB_NAME="storewise_prod"
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/storewise_backup_${TIMESTAMP}.sql"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function to cleanup old backups
cleanup_old_backups() {
    log "Cleaning up backups older than ${RETENTION_DAYS} days..."
    find ${BACKUP_DIR} -name "*.sql" -type f -mtime +${RETENTION_DAYS} -delete
    log "Old backups cleaned up successfully."
}

# Function to verify backup
verify_backup() {
    local backup_file=$1
    local file_size=$(stat -c%s "${backup_file}" 2>/dev/null || echo "0")

    if [ "${file_size}" -gt "0" ]; then
        log "Backup verification successful: ${backup_file} (${file_size} bytes)"
        return 0
    else
        log "ERROR: Backup verification failed: ${backup_file} is empty or missing"
        return 1
    fi
}

# Function to create backup
create_backup() {
    log "Starting database backup..."

    # Create the backup using pg_dump
    pg_dump \
        --host=${DB_HOST} \
        --port=${DB_PORT} \
        --username=${DB_USER} \
        --dbname=${DB_NAME} \
        --verbose \
        --format=custom \
        --compress=9 \
        --file="${BACKUP_FILE}" \
        --lock-wait-timeout=30000 \
        --no-password

    if [ $? -eq 0 ]; then
        log "Database backup completed successfully: ${BACKUP_FILE}"

        # Verify the backup
        if verify_backup "${BACKUP_FILE}"; then
            # Create a compressed version
            gzip "${BACKUP_FILE}"
            COMPRESSED_FILE="${BACKUP_FILE}.gz"

            if [ -f "${COMPRESSED_FILE}" ]; then
                log "Backup compressed: ${COMPRESSED_FILE}"

                # Calculate checksum
                CHECKSUM_FILE="${BACKUP_DIR}/checksums.txt"
                MD5_CHECKSUM=$(md5sum "${COMPRESSED_FILE}" | awk '{print $1}')
                echo "${TIMESTAMP} ${COMPRESSED_FILE} ${MD5_CHECKSUM}" >> "${CHECKSUM_FILE}"
                log "Checksum added to ${CHECKSUM_FILE}"
            fi
        else
            log "ERROR: Backup verification failed"
            exit 1
        fi
    else
        log "ERROR: Database backup failed"
        exit 1
    fi
}

# Function to backup uploads directory
backup_uploads() {
    log "Backing up uploads directory..."
    UPLOADS_BACKUP_DIR="${BACKUP_DIR}/uploads_${TIMESTAMP}"

    if [ -d "/app/uploads" ]; then
        cp -r /app/uploads "${UPLOADS_BACKUP_DIR}"
        log "Uploads backup completed: ${UPLOADS_BACKUP_DIR}"

        # Compress uploads backup
        tar -czf "${UPLOADS_BACKUP_DIR}.tar.gz" -C "${BACKUP_DIR}" "uploads_${TIMESTAMP}"
        rm -rf "${UPLOADS_BACKUP_DIR}"
        log "Uploads backup compressed: ${UPLOADS_BACKUP_DIR}.tar.gz"
    else
        log "No uploads directory found, skipping uploads backup"
    fi
}

# Function to send backup to remote storage (optional)
send_to_remote_storage() {
    # This function can be customized to send backups to remote storage
    # Examples: AWS S3, Google Cloud Storage, Azure Blob Storage, FTP, etc.

    # Example for AWS S3 (requires aws-cli):
    # if command -v aws &> /dev/null; then
    #     log "Sending backup to AWS S3..."
    #     aws s3 cp "${BACKUP_FILE}.gz" "s3://your-backup-bucket/database/"
    #     log "Backup sent to AWS S3 successfully"
    # fi

    # Example for FTP (requires lftp):
    # if command -v lftp &> /dev/null; then
    #     log "Sending backup to FTP server..."
    #     lftp -u username:password -e "put ${BACKUP_FILE}.gz /backup/" ftp.yourserver.com
    #     log "Backup sent to FTP server successfully"
    # fi
}

# Function to notify about backup status
send_notification() {
    local status=$1
    local message=$2

    # This function can be customized to send notifications
    # Examples: Email, Slack, Discord, Telegram, etc.

    # Example for email notification (requires mail command):
    # if command -v mail &> /dev/null; then
    #     echo "${message}" | mail -s "StoreWise Backup ${status}" admin@yourcompany.com
    # fi

    # Example for Slack webhook:
    # if [ -n "${SLACK_WEBHOOK_URL}" ]; then
    #     curl -X POST -H 'Content-type: application/json' \
    #         --data "{\"text\":\"${message}\"}" \
    #         "${SLACK_WEBHOOK_URL}"
    # fi

    log "Notification sent: ${message}"
}

# Main execution
main() {
    log "=== StoreWise Database Backup Script Started ==="

    # Pre-backup checks
    if ! command -v pg_dump &> /dev/null; then
        log "ERROR: pg_dump command not found. Please install PostgreSQL client tools."
        exit 1
    fi

    # Test database connection
    if ! pg_isready -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -q; then
        log "ERROR: Cannot connect to database"
        exit 1
    fi

    log "Database connection verified successfully"

    # Create backup
    create_backup

    # Backup uploads directory
    backup_uploads

    # Send to remote storage (if configured)
    send_to_remote_storage

    # Cleanup old backups
    cleanup_old_backups

    # Get backup file size for logging
    BACKUP_SIZE=$(du -h "${BACKUP_FILE}.gz" 2>/dev/null | cut -f1 || echo "Unknown")

    # Success notification
    SUCCESS_MESSAGE="StoreWise database backup completed successfully at $(date). File: ${BACKUP_FILE}.gz (Size: ${BACKUP_SIZE})"
    log "${SUCCESS_MESSAGE}"
    send_notification "SUCCESS" "${SUCCESS_MESSAGE}"

    log "=== StoreWise Database Backup Script Completed ==="
}

# Handle script arguments
case "${1:-}" in
    "backup"|"")
        main
        ;;
    "cleanup")
        cleanup_old_backups
        ;;
    "verify")
        if [ -n "${2:-}" ]; then
            verify_backup "$2"
        else
            log "Usage: $0 verify <backup_file>"
            exit 1
        fi
        ;;
    "help"|"-h"|"--help")
        echo "StoreWise Database Backup Script"
        echo ""
        echo "Usage: $0 [COMMAND]"
        echo ""
        echo "Commands:"
        echo "  backup   Create a new database backup (default)"
        echo "  cleanup  Remove backups older than ${RETENTION_DAYS} days"
        echo "  verify   Verify a backup file"
        echo "  help     Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0                    # Create backup"
        echo "  $0 backup              # Create backup"
        echo "  $0 cleanup             # Clean old backups"
        echo "  $0 verify backup.sql.gz # Verify backup file"
        echo ""
        exit 0
        ;;
    *)
        log "ERROR: Unknown command '$1'"
        log "Use '$0 help' for available commands"
        exit 1
        ;;
esac