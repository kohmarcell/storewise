import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/lib/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/card'
import { Input } from '@/lib/components/ui/input'
import { Label } from '@/lib/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs'
import { uploadsApi } from '@/lib/api'
import { Upload, X, Image, Settings } from 'lucide-react'

interface UploadedImage {
  filename: string
  url: string
  size: number
  createdAt: Date
  modifiedAt: Date
}

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const { data: logos = [] } = useQuery({
    queryKey: ['logos'],
    queryFn: () => uploadsApi.getImages('logo'),
    select: (response) => response.data
  })

  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => uploadsApi.uploadImage('logo', file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logos'] })
      setSelectedFile(null)
      toast.success('Logo uploaded successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload logo')
    }
  })

  const deleteLogoMutation = useMutation({
    mutationFn: (filename: string) => uploadsApi.deleteImage('logo', filename),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logos'] })
      toast.success('Logo deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete logo')
    }
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file)
      } else {
        toast.error('Please select an image file')
      }
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
    } else {
      toast.error('Please select an image file')
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      uploadLogoMutation.mutate(selectedFile)
    }
  }

  const handleDelete = (filename: string) => {
    if (confirm('Are you sure you want to delete this logo?')) {
      deleteLogoMutation.mutate(filename)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo Management</CardTitle>
              <CardDescription>
                Upload and manage your store logos and branding images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div className="space-y-4">
                <Label>Upload New Logo</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium">Drop logo here or click to browse</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Select File
                    </Button>
                  </div>
                </div>

                {/* Selected File Preview */}
                {selectedFile && (
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex justify-center">
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="max-h-32 max-w-full object-contain border rounded"
                      />
                    </div>

                    <Button
                      onClick={handleUpload}
                      disabled={uploadLogoMutation.isPending}
                      className="w-full"
                    >
                      {uploadLogoMutation.isPending ? 'Uploading...' : 'Upload Logo'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Existing Logos */}
              <div className="space-y-4">
                <Label>Uploaded Logos</Label>
                {logos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No logos uploaded yet
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {logos.map((logo: UploadedImage) => (
                      <div key={logo.filename} className="border rounded-lg p-4 space-y-3">
                        <div className="aspect-square flex items-center justify-center bg-gray-50 rounded">
                          <img
                            src={`http://localhost:3001${logo.url}`}
                            alt={logo.filename}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium truncate">{logo.filename}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(logo.size)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(logo.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => window.open(`http://localhost:3001${logo.url}`, '_blank')}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigator.clipboard.writeText(`http://localhost:3001${logo.url}`)}
                          >
                            Copy URL
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(logo.filename)}
                            disabled={deleteLogoMutation.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your store's general settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Store Name</Label>
                <Input placeholder="Enter store name" />
              </div>
              <div className="space-y-2">
                <Label>Store Email</Label>
                <Input type="email" placeholder="Enter store email" />
              </div>
              <div className="space-y-2">
                <Label>Store Phone</Label>
                <Input placeholder="Enter store phone" />
              </div>
              <div className="space-y-2">
                <Label>Store Address</Label>
                <Input placeholder="Enter store address" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
