/* @flow */

export function stackify(fn: Function, length?: number) {
    return (stack: number[]) => {
        const args = [];
        for (let i = 0; i < (length || fn.length); i++)
            args.push(stack.pop());
        stack.push(fn.apply(null, args.reverse()));
    };
}

export default function postfix(input: string, operators?: any): number[] {
    operators = Object.assign({
        "+": stackify((a, b) => a + b),
        "-": stackify((a, b) => a - b),
        "*": stackify((a, b) => a * b),
        "/": stackify((a, b) => a / b),
        "%": stackify((a, b) => a % b),
        "^": stackify(Math.pow),
    }, operators);
    
    const commands = input.split(" ").filter(x => x.length > 0),
        stack = [];
    
    for (let i = 0; i < commands.length; i++) {
        if (! isNaN(parseFloat(commands[i])))
            stack.push(parseFloat(commands[i]))
        else
            operators[commands[i]](stack);
    }
    
    return stack;
}
