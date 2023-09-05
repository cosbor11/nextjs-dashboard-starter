
export const getPasswordStrength = (password: string) => {
  let score = 4
  if (password.length < 7) score--;
  if (password.length < 9) score--;

  // Checking for uppercase letter
  if (!/[A-Z]/.test(password)) {
    score -= 1;
  }

  // Checking for special character
  if (!/[\!\@\#\$\%\^\&\*\(\)\-\_\=\+\{\}\[\]\|:;<>,\.\?\/~`]/.test(password)) {
    score -= 1;
  }

  return score;
};