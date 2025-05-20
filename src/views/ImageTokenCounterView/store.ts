import { atom, computed } from 'nanostores';

export const $tokenCount = atom(0);


export const updateTokenCount = (newTokenCount: number) => {
  $tokenCount.set(newTokenCount);
};

export const resetTokenCount = () => {
  $tokenCount.set(0);
};