import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';
//import { Base64EncodedImage } from '../base64-encoded-image';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css']
})
export class WebcamComponent implements OnInit {
  
  WIDTH: number = 440;
  HEIGHT: number = 280;
  imageSrc: any;

  @ViewChild('video',{ static: true}) video: ElementRef;

  @ViewChild('canvas',{ static: true}) canvasRef: ElementRef;

  @ViewChild('imageX',{ static: true}) imageX: ElementRef;

  constructor(private elRef: ElementRef) { }

  stream: any;
  detection: any;
  resizedDetections: any;
  canvas: any;
  canvasEl: any;
  displaySize: any;
  canvas2: any;
  canvasEl2: any;
  displaySize2: any;
  videoInput: any;
  imageInput: any;
  faceMatcher: any;
  uploadedDetection: any  = null;

  async ngOnInit() {
    await Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/models'),
    await faceapi.nets.faceLandmark68Net.loadFromUri('../../assets/models'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('../../assets/models'),
    await faceapi.nets.ssdMobilenetv1.loadFromUri('../../assets/models'),
    await faceapi.nets.faceExpressionNet.loadFromUri('../../assets/models'),]).then(() => this.startVideo());
  }

  startVideo() {
    this.videoInput = this.video.nativeElement;
    navigator.getUserMedia(
      { video: {}, audio: false },
      (stream) => (this.videoInput.srcObject = stream),
      (err) => console.log(err)
    );
    this.detect_Faces();
    }
  
  async detect_Faces() {
  
       this.elRef.nativeElement.querySelector('video').addEventListener('play', async () => {
       this.canvas = await faceapi.createCanvasFromMedia(this.videoInput);
       this.canvasEl = this.canvasRef.nativeElement;
       this.canvasEl.appendChild(this.canvas);
       this.canvas.setAttribute('id', 'canvass');
       this.canvas.setAttribute(
          'style',`position: fixed;
          top: 0;
          left: 0;`
       );
       this.displaySize = {
          width: this.videoInput.width,
          height: this.videoInput.height,
       };
       faceapi.matchDimensions(this.canvas, this.displaySize);

       setInterval(async () => {
         this.detection = await faceapi.detectAllFaces(this.videoInput,  new  faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
         this.resizedDetections = faceapi.resizeResults(
            this.detection,
            this.displaySize
          );
         this.canvas.getContext('2d').clearRect(0, 0,  this.canvas.width,this.canvas.height);
         faceapi.draw.drawDetections(this.canvas, this.resizedDetections);
         faceapi.draw.drawFaceLandmarks(this.canvas, this.resizedDetections);
         //faceapi.draw.drawFaceExpressions(this.canvas, this.resizedDetections);
        //  if (this.uploadedDetection !== null) {
        //  // const bestMatch = this.faceMatcher.findBestMatch(this.resizedDetections.descriptor);
        //   console.log(this.uploadedDetection);
        // }
        // this.faceMatcher = new faceapi.FaceMatcher(this.resizedDetections);
        // console.log(this.faceMatcher);

      }, 100);

      });

    }

    async selectFile(event: any) {
      const file = event.target.files.item(0);
      const reader = new FileReader();
      reader.onload = (e: any) => this.imageSrc = e.target.result;
      reader.readAsDataURL(file);
      this.imageInput = this.imageX.nativeElement;
      this.imageInput.setAttribute('id', 'canvass2');
      this.imageInput.setAttribute(
        'style',`height: 260px; width: 480px;`
     );

      this.uploadedDetection = await faceapi.detectAllFaces(this.imageInput, new  faceapi.TinyFaceDetectorOptions());
     // console.log(this.uploadedDetection);

     //this.faceMatcher = new faceapi.FaceMatcher(this.uploadedDetection);
     //console.log(this.faceMatcher);
     
    }

}
