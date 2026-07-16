let cartGeneration = 0;

export function bumpCartGeneration(): void {
  cartGeneration += 1;
}

export function getCartGeneration(): number {
  return cartGeneration;
}
