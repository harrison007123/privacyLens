import * as ort from "onnxruntime-web";

let session: ort.InferenceSession | null = null;
let isLoaded = false;

// Preload the model
export async function loadVisionModel() {
    if (isLoaded) return true;

    try {
        session = await ort.InferenceSession.create("/models/mobilenetv3.onnx", {
            executionProviders: ["webgpu"]
        });
        isLoaded = true;
        return true;
    } catch (err) {
        console.error("Failed to load ONNX model:", err);
        return false;
    }
}

export type VisionResult = {
    latencyMs: number;
    outputLength: number;
    model: string;
};

// Run inference on a canvas element (simulating ROI extraction)
export async function runLocalVision(canvas: HTMLCanvasElement): Promise<VisionResult> {
    if (!session) {
        await loadVisionModel();
    }

    if (!session) {
        throw new Error("Model not loaded");
    }

    // Create an offscreen canvas to resize to 224x224
    const resizer = document.createElement('canvas');
    resizer.width = 224;
    resizer.height = 224;
    const ctx = resizer.getContext('2d');
    if (!ctx) throw new Error("Could not get 2d context");

    // Draw ROI to 224x224
    ctx.drawImage(canvas, 0, 0, 224, 224);
    const imageData = ctx.getImageData(0, 0, 224, 224);
    const pixels = imageData.data;

    // ImageNet normalization
    const tensorData = new Float32Array(1 * 3 * 224 * 224);
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];

    for (let i = 0; i < 224 * 224; i++) {
        const r = pixels[i * 4] / 255;
        const g = pixels[i * 4 + 1] / 255;
        const b = pixels[i * 4 + 2] / 255;

        // NCHW layout
        tensorData[i] = (r - mean[0]) / std[0];
        tensorData[224 * 224 + i] = (g - mean[1]) / std[1];
        tensorData[2 * 224 * 224 + i] = (b - mean[2]) / std[2];
    }

    const tensor = new ort.Tensor("float32", tensorData, [1, 3, 224, 224]);

    const start = performance.now();
    const results = await session.run({
        [session.inputNames[0]]: tensor
    });
    const end = performance.now();

    const output = results[session.outputNames[0]];

    return {
        latencyMs: end - start,
        outputLength: output.data.length,
        model: "MobileNetV3 (WebGPU)"
    };
}
