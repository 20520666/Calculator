import {Component} from "react";
import "./App.css";

export default class App extends Component<any, any> {

    // Von Neumann model

    // properties define
    private result: string;
    private program_counter: number;
    private instruction: string;
    private text_length: number;
    private readonly TEXT_LIMIT: number = 11;

    // constructor define
    public constructor(props: any) {
        super(props);
        this.result = "0";
        this.program_counter = 0;
        this.text_length = 0;
        this.instruction = "none";
        this.controlUnit = this.controlUnit.bind(this);
        this.processingUnit = this.processingUnit.bind(this);
        this.state = {
            text: "",
        }
    }

    // methods define
    public controlUnit(event?: any): any {
        event.preventDefault();
        event.target.blur();
        const input = event.target.name.toString();
        // delete text content
        if (input === "CE") {
            this.clearText();
            if (this.instruction === "none") {
                this.result = "0";
                this.program_counter = 0;
            }
        }
        if (input === "C") {
            this.clearScreen();
        }
        if (input === "del") {
            if (this.text_length === 0) {
                this.clearScreen();
                return;
            }
            this.setState({text: this.state.text.slice(0, -1)});
            this.text_length--;
        }
        // add text content

        if ((input.charCodeAt(0) >= '0'.charCodeAt(0) && input.charCodeAt(0) <= '9'.charCodeAt(0))) {
            if (this.text_length >= this.TEXT_LIMIT) {
                return;
            }
            this.setState({text: this.state.text + input});
            this.text_length++;
        }
        if (input === ".") {
            if (this.text_length >= this.TEXT_LIMIT) {
                return;
            }
            if (this.state.text === "") {
                this.setState({text: "0."});
                this.text_length = 2;
                return;
            }
            this.setState({text: this.state.text + "."});
            this.text_length++;
        }
        // unary operator
        if (input === "%") {
            this.instruction = "percent";
            this.processingUnit();
        }
        if (input === "frac") {
            this.instruction = "frac";
            this.processingUnit();
        }
        if (input === "pow") {
            this.instruction = "pow";
            this.processingUnit();
        }
        if (input === "sqrt") {
            this.instruction = "sqrt";
            this.processingUnit();
        }
        if (input === "changeSign") {
            this.instruction = "sign";
            this.processingUnit();
        }
        // binary operator
        if (input === "add") {
            this.processingUnit();
            if (this.instruction !== "add") {
                this.result = this.program_counter.toString() + " + ";
                this.clearText();
                this.instruction = "add";
                return;
            }
        }
        if (input === "minus") {
            this.processingUnit();
            if (this.instruction !== "minus") {
                this.result = this.program_counter.toString() + " - ";
                this.clearText();
                this.instruction = "minus";
                return;
            }

        }
        if (input === "mul") {
            this.processingUnit();
            if (this.instruction !== "multi") {
                this.result = this.program_counter.toString() + " * ";
                this.clearText();
                this.instruction = "multi";
                return;
            }
        }
        if (input === "div") {
            this.processingUnit();
            if (this.instruction !== "div") {
                this.result = this.program_counter.toString() + " / ";
                this.clearText();
                this.instruction = "div";
                return;
            }
        }
        // Execution with equal operator
        if (input === "=") {
            this.processingUnit();
        }
    }

    public processingUnit(): void {
        if (this.instruction === "none") {
            if (this.state.text === "") {
                return;
            }
            this.program_counter = parseFloat(parseFloat(this.state.text).toFixed(4));
            this.result = this.program_counter.toString();
        }
        if (this.state.text === "") {
            this.setState({text: this.program_counter}, () => {
                this.processingUnit();
            });
            return;
        }

        if (this.instruction === "percent") {
            this.program_counter = parseFloat((parseFloat(this.state.text) / 100).toFixed(4));
            this.result = this.state.text + "% = " + this.program_counter.toString();
        }
        if (this.instruction === "frac") {
            let tmp = parseFloat(parseFloat(this.state.text).toFixed(4));
            if (tmp === 0) {
                this.result = "Math error: divide by zero!";
                this.clearText();
                this.instruction = "none";
                return;
            }
            this.program_counter = tmp;
            this.result = "1/" + this.state.text + " = " + this.program_counter.toString();
        }
        if (this.instruction === "pow") {
            this.program_counter = parseFloat(Math.pow(parseFloat(this.state.text), 2).toFixed(4));
            this.result = this.state.text + "^2 = " + this.program_counter.toString();
        }
        if (this.instruction === "sqrt") {
            let tmp = parseFloat(parseFloat(this.state.text).toFixed(4));
            if (tmp < 0) {
                this.result = "Math error: sqrt for negative number!";
                this.clearText();
                this.instruction = "none";
                return;
            }
            this.program_counter = Math.sqrt(tmp);
            this.result = "sqrt(" + this.state.text + ") = " + this.program_counter.toString();
        }
        if (this.instruction === "sign") {
            this.program_counter = parseFloat((0 - parseFloat(this.state.text)).toFixed(4));
            this.result = this.program_counter.toString();
        }
        if (this.instruction === "add") {
            this.result += this.state.text;
            this.program_counter += parseFloat(parseFloat(this.state.text).toFixed(4));
            this.result += " = " + this.program_counter.toString();
        }
        if (this.instruction === "minus") {
            this.result += this.state.text;
            this.program_counter -= parseFloat(parseFloat(this.state.text).toFixed(4));
            this.result += " = " + this.program_counter.toString();
        }
        if (this.instruction === "multi") {
            this.result += this.state.text;
            this.program_counter *= parseFloat(parseFloat(this.state.text).toFixed(4));
            this.result += " = " + this.program_counter.toString();
        }
        if (this.instruction === "div") {

            let tmp = parseFloat(parseFloat(this.state.text).toFixed(4));
            if (tmp === 0) {
                this.result = "Math error: divide by zero!";
                this.clearText();
                this.instruction = "none";
                return;
            }
            this.result += this.state.text;
            this.program_counter /= tmp;
            this.result += " = " + this.program_counter.toString();
        }
        this.clearText();
        this.instruction = "none";
        if (this.program_counter.toString() === "NaN" || this.program_counter.toString() === "Infinity") {
            this.result = "Syntax Error!";
            this.program_counter = 0;
        }
    }

    public clearText(): void {
        this.setState({text: ""});
        this.text_length = 0;
    }

    public clearScreen(): void {
        this.result = "0";
        this.program_counter = 0;
        this.instruction = "none";
        this.clearText();
    }

    public render(): any {

        return (
            <>
                <div className="calculator-grid">
                    <div className="display-screen">
                        <div className="result">{this.result}</div>
                        <div className="text">{this.state.text}</div>
                    </div>
                    <div className="keypad">
                        <button name="%" onClick={this.controlUnit}>%</button>
                        <button name="CE" onClick={this.controlUnit}>CE</button>
                        <button name="C" onClick={this.controlUnit}>C</button>
                        <button name="del" onClick={this.controlUnit}>&#9003;</button>
                        <button name="frac" onClick={this.controlUnit}>1/x</button>
                        <button name="pow" onClick={this.controlUnit}>x&sup2;</button>
                        <button name="sqrt" onClick={this.controlUnit}>&radic;</button>
                        <button name="div" onClick={this.controlUnit}>&divide;</button>
                        <button name="7" onClick={this.controlUnit} className="light-hightlight">7</button>
                        <button name="8" onClick={this.controlUnit} className="light-hightlight">8</button>
                        <button name="9" onClick={this.controlUnit} className="light-hightlight">9</button>
                        <button name="mul" onClick={this.controlUnit}>&times;</button>
                        <button name="4" onClick={this.controlUnit} className="light-hightlight">4</button>
                        <button name="5" onClick={this.controlUnit} className="light-hightlight">5</button>
                        <button name="6" onClick={this.controlUnit} className="light-hightlight">6</button>
                        <button name="minus" onClick={this.controlUnit}>-</button>
                        <button name="1" onClick={this.controlUnit} className="light-hightlight">1</button>
                        <button name="2" onClick={this.controlUnit} className="light-hightlight">2</button>
                        <button name="3" onClick={this.controlUnit} className="light-hightlight">3</button>
                        <button name="add" onClick={this.controlUnit}>+</button>
                        <button name="changeSign" onClick={this.controlUnit} className="light-hightlight">+/-</button>
                        <button name="0" onClick={this.controlUnit} className="light-hightlight">0</button>
                        <button name="." onClick={this.controlUnit} className="light-hightlight">.</button>
                        <button name="=" onClick={this.controlUnit} className="blue-hightlight">=</button>
                    </div>
                </div>
            </>
        );
    }
}
