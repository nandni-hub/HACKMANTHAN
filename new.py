try:
  num1 = float(num1_str)
  num2 = float(num2_str)

  if operation == '+':
      result = add(num1, num2)
  elif operation == '-':
      result = subtract(num1, num2)
  elif operation == '*':
      result = multiply(num1, num2)
  elif operation == '/':
      result = divide(num1, num2)
  else:
      result = "Error: Invalid operation."

  print("Result:", result)

except ValueError:
  print("Error: Invalid input. Please enter numbers.")
