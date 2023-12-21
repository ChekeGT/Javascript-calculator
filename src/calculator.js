function createCalculator(){
        
    const numberRegex = /(\d+\.\d+|\d+)|\((\+|-)(\d+\.\d+|\d+)\)/g
    
    function getNumbers(expression){
       return expression.match(numberRegex).map((number) => +number.replace(/\(|\)/g, ''))
    }
    function getOperator(expression){
        let firstMatch = expression.match(numberRegex)[0];
        const operator = expression[firstMatch.length]
        return operator
    }
    function evaluateExpression(expression){
        const numbers = getNumbers(expression)
        const operator = getOperator(expression)
        console.log(operator, numbers)
        if (numbers.length != 2){
            return
        }

        const firstNumber = numbers[0]
        const secondNumber = numbers[1]

        let result; 
        switch(operator){
            case "/":
                result =  firstNumber / secondNumber
                break
            case "*":
                result =  firstNumber * secondNumber
                break
            case "+":
                result = firstNumber + secondNumber
                break
            case "-":
                result = firstNumber - secondNumber
                break
            default: 
                break
        }
        if (result < 0){
            return `(${result})`
        }
        return result
    }

}