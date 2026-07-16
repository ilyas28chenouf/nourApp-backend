import { TransformFnParams } from 'class-transformer';

export function preserveInputValue({ obj, key }: TransformFnParams): unknown {
  if (typeof obj !== 'object' || obj === null) return undefined;
  return (obj as Record<string, unknown>)[key];
}
