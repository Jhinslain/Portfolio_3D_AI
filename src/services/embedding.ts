import * as ort from 'onnxruntime-web';
import { pipeline, env } from '@xenova/transformers';

// Assure-toi d’appeler ça **avant** pipeline()
ort.env.wasm.wasmPaths = '/onnx/';
env.backends.onnx.wasm.numThreads = 2;
env.backends.onnx.wasm.simd = true;
env.backends.onnx.wasm.proxy = true;

let embedder: any = null;

export async function getEmbedding(text: string): Promise<number[]> {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      quantized: false, // tu peux essayer `true` aussi
    });
  }

  const output = await embedder(text, {
    pooling: 'mean',
    normalize: true,
  });

  return Array.from(output.data); // Tensor => number[]
}


export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (normA * normB);
}
