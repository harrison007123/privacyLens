import * as ort from "onnxruntime-web";

let session = null;

const status = document.getElementById("status");
const preview = document.getElementById("preview");
const imageInput = document.getElementById("imageInput");


// Load model
async function loadModel() {
    status.textContent = "Loading model...";

    try {
        session = await ort.InferenceSession.create(
            "/models/mobilenetv3.onnx",
            {
                executionProviders: ["webgpu"]
            }
        );

        status.textContent =
            "✓ Model loaded\n" +
            "✓ ONNX Runtime Web\n" +
            "✓ WebGPU\n\n" +
            "Input: " + session.inputNames[0] +
            "\nOutput: " + session.outputNames[0];

    } catch (error) {
        console.error(error);
        status.textContent = "Model error:\n" + error;
    }
}


// Preview selected image
imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (!file) return;

    preview.src = URL.createObjectURL(file);

    status.textContent = "Image selected.";
});


// Run inference
document.getElementById("run").onclick = async () => {

    if (!session) {
        status.textContent = "Model not loaded.";
        return;
    }

    if (!preview.src) {
        status.textContent = "Select an image first.";
        return;
    }

    try {

        status.textContent = "Processing image...";

        // Create canvas
        const canvas = document.createElement("canvas");

        canvas.width = 224;
        canvas.height = 224;

        const ctx = canvas.getContext("2d");

        // Draw image into 224x224
        ctx.drawImage(
            preview,
            0,
            0,
            224,
            224
        );

        // Get pixels
        const imageData = ctx.getImageData(
            0,
            0,
            224,
            224
        );

        const pixels = imageData.data;


        // Create tensor
        const tensorData = new Float32Array(
            1 * 3 * 224 * 224
        );


        // ImageNet normalization
        const mean = [0.485, 0.456, 0.406];
        const std = [0.229, 0.224, 0.225];


        for (let i = 0; i < 224 * 224; i++) {

            const r = pixels[i * 4] / 255;
            const g = pixels[i * 4 + 1] / 255;
            const b = pixels[i * 4 + 2] / 255;


            // NCHW layout

            tensorData[i] =
                (r - mean[0]) / std[0];

            tensorData[
                224 * 224 + i
            ] =
                (g - mean[1]) / std[1];

            tensorData[
                2 * 224 * 224 + i
            ] =
                (b - mean[2]) / std[2];
        }


        const tensor = new ort.Tensor(
            "float32",
            tensorData,
            [1, 3, 224, 224]
        );


        console.log(
            "Tensor created:",
            tensor.dims
        );


        // Run inference
        const start = performance.now();

        const results = await session.run({

            [session.inputNames[0]]: tensor

        });

        const end = performance.now();

        const output =
            results[session.outputNames[0]];


        console.log("Output:", output);


        status.textContent =
            "✓ Local inference complete\n\n" +

            "Model: MobileNetV3\n" +

            "Backend: WebGPU\n" +

            "Input: 224 × 224\n" +

            "Tensor: 1 × 3 × 224 × 224\n\n" +

            "Inference time: " +
            (end - start).toFixed(2) +
            " ms\n\n" +

            "Output length: " +
            output.data.length;

    } catch (error) {

        console.error(error);

        status.textContent =
            "Inference error:\n" +
            error;

    }
};


loadModel();