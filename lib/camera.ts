// Camera service for capturing photos with location data
export class CameraService {
  private static instance: CameraService

  static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService()
    }
    return CameraService.instance
  }

  async capturePhoto(): Promise<{ imageData: string; location: GeolocationPosition | null }> {
    try {
      // Get user media for camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })

      // Create video element to display camera feed
      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve
      })

      // Create canvas to capture frame
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")!
      ctx.drawImage(video, 0, 0)

      // Stop camera stream
      stream.getTracks().forEach((track) => track.stop())

      // Get image data
      const imageData = canvas.toDataURL("image/jpeg", 0.8)

      // Get location data
      const location = await this.getCurrentLocation()

      return { imageData, location }
    } catch (error) {
      console.error("Camera capture error:", error)
      throw new Error("Failed to capture photo")
    }
  }

  private async getCurrentLocation(): Promise<GeolocationPosition | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          console.error("Location error:", error)
          resolve(null)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      )
    })
  }

  async uploadImage(imageData: string, issueId: string): Promise<string> {
    try {
      // Convert base64 to blob
      const response = await fetch(imageData)
      const blob = await response.blob()

      // In a real implementation, upload to Firebase Storage
      // For now, return the base64 data
      return imageData
    } catch (error) {
      console.error("Image upload error:", error)
      throw new Error("Failed to upload image")
    }
  }
}
