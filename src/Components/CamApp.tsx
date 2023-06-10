import React, { useRef, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const CamApp = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  const openWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.log("Error accessing webcam:", error);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Set the canvas dimensions to match the video stream
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current frame of the video onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas image to a data URL
        const dataURL = canvas.toDataURL("image/png");

        // Add the captured image to the state
        setCapturedImages((prevImages) => [...prevImages, dataURL]);
      }
    }
  };

  useEffect(() => {
    openWebcam();
  }, []);

  return (
    <div
      className="container"
      style={{ display: "flex",  minHeight: '600px', width: '1060px' }}
    >
      <video
        ref={videoRef}
        style={{ display: "block", width: "100%" }}
        autoPlay
      ></video>
      <button className="btn btn-success" onClick={capturePhoto}>
        Capture
      </button>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <div
      style={{ display: "flex",  flexDirection: 'column',width: '200px', maxHeight: '600px', overflowY: 'scroll'}}
      >
        {capturedImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Captured Image ${index + 1}`}
            style={{
              width: "140px",
              height: "140px",
              outline: "2px solid blue",
            }}
          />
        ))}
      </div>
    </div>
  );
};
