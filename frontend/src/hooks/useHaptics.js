export const useHaptics = () => {
  const vibrate = (pattern) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  return {
    vibrateLeft: () => vibrate([100, 50, 100]),
    vibrateRight: () => vibrate([300, 50, 300]),
    vibrateCenter: () => vibrate([200, 50, 200]),
    vibrateStop: () => vibrate([500, 100, 500, 100]),
    vibrateSuccess: () => vibrate([100]),
    vibrateError: () => vibrate([50, 50, 50, 50, 50]),
    vibrateSOS: () => vibrate([500, 200, 500, 200, 500])
  };
};
