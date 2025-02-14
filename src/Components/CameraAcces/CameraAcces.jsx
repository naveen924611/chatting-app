import React, { useRef, useState } from "react";

const CameraAccess = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  // Start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access the camera. Please check your permissions.");
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Take a photo
  const takePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const photoData = canvas.toDataURL("image/png"); // Save photo as a base64 string
      console.log("Photo captured:", photoData);

      // Optionally, you can create a download link for the photo
      const link = document.createElement("a");
      link.href = photoData;
      link.download = "photo.png";
      link.click();
    }
  };

  // Start recording video
  const startRecording = () => {
    const stream = videoRef.current.srcObject;
    const options = { mimeType: "video/webm" };

    const mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const videoURL = URL.createObjectURL(blob);
      console.log("Video recorded:", videoURL);

      // Optionally, you can create a download link for the video
      const link = document.createElement("a");
      link.href = videoURL;
      link.download = "video.webm";
      link.click();
    };

    mediaRecorder.start();
    setIsRecording(true);
    console.log("Recording started");
  };

  // Stop recording video
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("Recording stopped");
    }
  };

  return (
    <div>
      <h1>Camera Access</h1>
      <video ref={videoRef} style={{ width: "100%", height: "auto" }}></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <div>
        {!isCameraActive ? (
          <button onClick={startCamera}>Start Camera</button>
        ) : (
          <button onClick={stopCamera}>Stop Camera</button>
        )}
        {isCameraActive && (
          <>
            <button onClick={takePhoto}>Take Photo</button>
            {!isRecording ? (
              <button onClick={startRecording}>Start Recording</button>
            ) : (
              <button onClick={stopRecording}>Stop Recording</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CameraAccess;
