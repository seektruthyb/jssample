
/* Intersection Types */
(()=>{
    function extend<T, U>(first: T, second: U): T & U {
        let result = <T & U>{};
        for (let id in first) {
            (<any>result)[id] = (<any>first)[id];
        }
        for (let id in second) {
            if (!result.hasOwnProperty(id)) {
                (<any>result)[id] = (<any>second)[id];
            }
        }
        return result;
    }

    class Person {
        constructor(public name: string) { }
    }
    interface Loggable {
        log(): void;
    }
    class ConsoleLogger implements Loggable {
        log() {
            // ...
        }
    }

    let jim = extend(new Person("Jim"), new ConsoleLogger());
    console.dir(jim);

    let x = extend({ a: "hello" }, { b: 42 });
    let s = x.a;
    let n = x.b;

    interface Ix {
        a: string;
    }
    interface Iy {
        b: number;
    }
    let x2: Ix & Iy = extend({ a: 'hello' }, { b: 42 });
    let s2 = x2.a;
    let n2 = x2.b;

    let x3: Ix & Iy = { a: 'hello', b: 42 };
    let s3 = x3.a;
    let n3 = x3.b;
})();

/* Intersection types examples */
(()=>{
    interface Ia { a: number; }
    interface Ib { b: string; }

    let ab: Ia & Ib = {a: 1, b: 'str'};
    let a: Ia = ab;
    let b: Ib = ab;

    interface Ix { p: Ia; }
    interface Iy { p: Ib; }

    let xy: Ix & Iy = { p: ab }

    type F1 = (a: string, b: string) => void;
    type F2 = (a: number, b: number) => void;

    var f: F1 & F2 = (a: string | number, b: string | number) => { };
    f("hello", "world");  // Ok
    f(1, 2);              // Ok
    // f(1, "test");         // Error

    function func(a: string | number, b: string | number) { };
    func('str', 1);
    func(1, 1);
    func(1, 'str');
    // func(1, false); // Error
})();


/* Union Types */
(()=>{
    /**
     * Takes a string and adds "padding" to the left.
     * If 'padding' is a string, then 'padding' is appended to the left side.
     * If 'padding' is a number, then that number of spaces is added to the left side.
     */
    function padLeft(value: string, padding: any) {
        if (typeof padding === "number") {
            return Array(padding + 1).join(" ") + value;
        }
        if (typeof padding === "string") {
            return padding + value;
        }
        throw new Error(`Expected string or number, got '${padding}'.`);
    }

    console.log(padLeft("Hello world", 4)); // returns "    Hello world"

    // let indentedString = padLeft("Hello world", true); // passes at compile time, fails at runtime.

})();



(()=>{
    /**
     * Takes a string and adds "padding" to the left.
     * If 'padding' is a string, then 'padding' is appended to the left side.
     * If 'padding' is a number, then that number of spaces is added to the left side.
     */
    function padLeft(value: string, padding: string | number) {
        // ...
    }

    // let indentedString = padLeft("Hello world", true); // errors during compilation
})();



(()=>{
    interface Bird {
        fly(): void;
        layEggs(): void;
    }
    interface Fish {
        swim(): void;
        layEggs(): void;
    }
    function getSmallPet(): Fish | Bird {
        // ...
        let result: Fish = { swim: ()=>{}, layEggs: ()=>undefined};
        return result;
    }
    let pet = getSmallPet();
    pet.layEggs(); // okay
    // pet.swim();    // errors


    /* Type Guards and Differentiating Types */
    // 이러한 각 프로퍼티의 액세스는 오류를 발생시킵니다.
    // if (pet.swim) {
    //     pet.swim();
    // }
    // else if (pet.fly) {
    //     pet.fly();
    // }

    if ((<Fish>pet).swim) {
        (<Fish>pet).swim();
    }
    else {
        (<Bird>pet).fly();
    }

    /* User-Defined Type Guards */
    function isFish(pet: Fish | Bird): pet is Fish {
        return (<Fish>pet).swim !== undefined;
    }

    // Both calls to 'swim' and 'fly' are now okay.
    if (isFish(pet)) {
        pet.swim();
    }
    else {
        pet.fly();
    }

})();

(() => {
    let str_n_num: { a: string } & { b: number };
    // str_n_num = { a: 'str'};    // str_n_num type Error
    // str_n_num = { b: 1};    // str_n_num type Error
    // str_n_num = { a: 1, b: 1};  // a type Error
    // str_n_num = { a: 'str', b: 'str'};  // b type Error
    str_n_num = { a: 'str', b: 1};

    let str_u_num: { a: string } | { b: number };
    // str_u_num = { a: 1 }    // a type Error
    str_u_num = { a: 'str' }
    // str_u_num = { b: 'str' }    // b type Error
    str_u_num = { b: 1 }
    str_u_num = { a: 'str', b: 1 };
    str_u_num = { a: 'str', b: 'str' };

})();


/* typeof type guards */
(()=>{
    function isNumber(x: any): x is number {
        return typeof x === "number";
    }

    function isString(x: any): x is string {
        return typeof x === "string";
    }

    function padLeft(value: string, padding: string | number) {
        if (isNumber(padding)) {
            return Array(padding + 1).join(" ") + value;
        }
        if (isString(padding)) {
            return padding + value;
        }
        throw new Error(`Expected string or number, got '${padding}'.`);
    }
})();



(()=>{
    function padLeft(value: string, padding: string | number) {
        if (typeof padding === "number") {
            return Array(padding + 1).join(" ") + value;
        }
        if (typeof padding === "string") {
            return padding + value;
        }
        throw new Error(`Expected string or number, got '${padding}'.`);
    }
})();


/* instanceof type guards */
(()=>{
    interface Padder {
        getPaddingString(): string
    }
    class SpaceRepeatingPadder implements Padder {
        constructor(private numSpaces: number) { }
        getPaddingString() {
            return Array(this.numSpaces + 1).join(" ");
        }
    }
    class StringPadder implements Padder {
        constructor(private value: string) { }
        getPaddingString() {
            return this.value;
        }
    }
    function getRandomPadder() {
        return Math.random() < 0.5 ?
            new SpaceRepeatingPadder(4) :
            new StringPadder("  ");
    }

    // 'SpaceRepeatingPadder | StringPadder' 타입입니다.
    let padder: Padder = getRandomPadder();
    if (padder instanceof SpaceRepeatingPadder) {
        padder; // 타입이 'SpaceRepeatingPadder'로 좁혀졌습니다.
    }
    if (padder instanceof StringPadder) {
        padder; // 타입이 'StringPadder'로 좁혀졌습니다.
    }
})();


/* Nullable types */
(()=>{
    let s = "foo";
    // s = null; // error, 'null' is not assignable to 'string'
    let sn: string | null = "bar";
    sn = null; // ok
    // sn = undefined; // error, 'undefined' is not assignable to 'string | null'
})();



(()=>{
    function f(x: number, y?: number) {
        return x + (y || 0);
    }
    f(1, 2);
    f(1);
    f(1, undefined);
    // f(1, null); // error, 'null'은 'number | undefined' 타입에 할당할 수 없습니다.

})();



(()=>{
    class C {
        a!: number;
        b?: number;
    }
    let c = new C();
    c.a = 12;
    // c.a = undefined; // error, 'undefined' is not assignable to 'number'
    c.b = 13;
    c.b = undefined; // ok
    // c.b = null; // error, 'null' is not assignable to 'number | undefined'
})();


/* Type guards and type assertions */
(()=>{
    function f(sn: string | null): string {
        if (sn == null) {
            return "default";
        }
        else {
            return sn;
        }
    }
})();



(()=>{
    function f(sn: string | null): string {
        return sn || "default";
    }
})();



(()=>{
    // function broken(name: string | null): string {
    //     function postfix(epithet: string) {
    //         return name.charAt(0) + '.  the ' + epithet; // error, 'name' is possibly null
    //     }
    //     name = name || "Bob";
    //     return postfix("great");
    // }
    function fixed(name: string | null): string {
        function postfix(epithet: string) {
            return name!.charAt(0) + '.  the ' + epithet; // ok
        }
        name = name || "Bob";
        return postfix("great");
    }
})();


/* Type Aliases */
(()=>{
    type Name = string;
    type NameResolver = () => string;
    type NameOrResolver = Name | NameResolver;
    function getName(n: NameOrResolver): Name {
        if (typeof n === "string") {
            return n;
        }
        else {
            return n();
        }
    }
})();


(()=>{
    type Container<T> = { value: T };

})();


(()=>{
    type Tree<T> = {
        value: T;
        left: Tree<T>;
        right: Tree<T>;
    }
})();


(()=>{
    type LinkedList<T> = T & { next: LinkedList<T> };
    interface Person {
        name: string;
    }
    var people: LinkedList<Person> = <LinkedList<Person>>{name: 'John'};
    var s = people.name;
    // var s = people.next.name;    Runtime Error
    // var s = people.next.next.name;
    // var s = people.next.next.next.name;
})();


(()=>{
    // type Yikes = Array<Yikes>; // error, TS2456: Type alias 'Yikes' circularly references itself.
})();


/* Interfaces vs. Type Aliases */

type Alias = { num: number }
interface Interface {
    num: number;
}
declare function aliased(arg: Alias): Alias;
declare function interfaced(arg: Interface): Interface;
(()=>{
})();


/* String Literal Types */
(()=>{
    type Easing = "ease-in" | "ease-out" | "ease-in-out";
    class UIElement {
        animate(dx: number, dy: number, easing: Easing) {
            if (easing === "ease-in") {
                // ...
            }
            else if (easing === "ease-out") {
            }
            else if (easing === "ease-in-out") {
            }
            else {
                // error! null 또는 undefined를 넘겨서는 안됩니다.
            }
        }
    }
    let button = new UIElement();
    button.animate(0, 0, "ease-in");
    // button.animate(0, 0, "uneasy"); // error: "uneasy"는 여기에 사용할 수 없습니다.

})();

/* Discriminated Union */
(()=>{
    interface Square {
        kind: "square";
        size: number;
    }
    interface Rectangle {
        kind: "rectangle";
        width: number;
        height: number;
    }
    interface Circle {
        kind: "circle";
        radius: number;
    }

    type Shape = Square | Rectangle | Circle;

    function area(s: Shape) {
        switch (s.kind) {
            case "square": return s.size * s.size;
            case "rectangle": return s.height * s.width;
            case "circle": return Math.PI * s.radius ** 2;
        }
    }


    /* Exhaustiveness checking */
    interface Triangle {
        kind: 'triangle';
        width: number;
        height: number;
    }

    type Shape2 = Square | Rectangle | Circle | Triangle;

    function assertNever(x: never): never {
        throw new Error("Unexpected object: " + x);
    }

    function area2(s: Shape) {
        switch (s.kind) {
            case "square": return s.size * s.size;
            case "rectangle": return s.height * s.width;
            case "circle": return Math.PI * s.radius ** 2;
            default: return assertNever(s); // error here if there are missing cases
        }
        // should error here - we didn't handle case "triangle"
    }
})();

/* Polymorphic this types */
(()=>{
    class BasicCalculator {
        public constructor(protected value: number = 0) { }
        public currentValue(): number {
            return this.value;
        }
        public add(operand: number): this {
            this.value += operand;
            return this;
        }
        public multiply(operand: number): this {
            this.value *= operand;
            return this;
        }
        // ... other operations go here ...
    }
    let v = new BasicCalculator(2)
        .multiply(5)
        .add(1)
        .currentValue();

    class ScientificCalculator extends BasicCalculator {
        public constructor(value = 0) {
            super(value);
        }
        public sin(): this {
            this.value = Math.sin(this.value);
            return this;
        }
        // ... other operations go here ...
    }
    let v2 = new ScientificCalculator(2)
        .multiply(5)
        .sin()
        .add(1)
        .currentValue();
})();

/* Index types */
(()=>{
    function pluck(o: any, names: string[]) {
        return names.map(n => o[n]);
    }

    const obj = {
        a: 1,
        b: 2,
        c: 3
    }

    const pluckAB = pluck(obj, ['a', 'b']);
    console.log('pluckAB : ');
    console.dir(pluckAB);
})();


(()=>{
    function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
        return names.map(n => o[n]);
    }
    interface Person {
        name: string;
        age: number;
    }
    let person: Person = {
        name: 'Jarid',
        age: 35
    };
    let strings: string[] = pluck(person, ['name']); // ok, string[]

    let personProps: keyof Person; // 'name' | 'age'
    personProps = "name";
    personProps = "age";

    // pluck(person, ['age', 'unknown']); // error, 'unknown' is not in 'name' | 'age'
    pluck(person, ['age', 'name']); // ok

    function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
        return o[name]; // o[name] is of type T[K]
    }

    let name: string = getProperty(person, 'name');
    let age: number = getProperty(person, 'age');
    // let unknown = getProperty(person, 'unknown'); // error, 'unknown' is not in 'name' | 'age'


    /* Index types and string index signatures */
    interface Map<T> {
        [key: string]: T;
    }
    let keys: keyof Map<number>; // string
    let value: Map<number>['foo']; // number
})();


/* Mapped type */
(()=>{
    interface PersonPartial {
        name?: string;
        age?: number;
    }

    interface PersonReadonly {
        readonly name: string;
        readonly age: number;
    }

    const personPartial: PersonPartial = { name: 'anonymous' };
    personPartial.name = 'Tom';
    const personReadonly: PersonReadonly = { name: 'anonymous', age: 0 };
    // personReadonly.name = 'Tom'; // Error
})();


(()=>{
    interface Person {
        name: string;
        age: number;
    }
    type Readonly<T> = {
        readonly [P in keyof T]: T[P];
    }
    type Partial<T> = {
        [P in keyof T]?: T[P];
    }

    type PersonPartial = Partial<Person>;
    type PersonReadonly = Readonly<Person>;

    const personPartial: PersonPartial = { name: 'anonymous' };
    personPartial.name = 'Tom';
    const personReadonly: PersonReadonly = { name: 'anonymous', age: 0 };
    // personReadonly.name = 'Tom'; // Error
})();


(()=>{
    type Keys = 'option1' | 'option2';
    type Flags = { [K in Keys]: boolean };
    const v: Flags = { option1: true, option2: false };
    console.dir(v);
})();


(()=>{
    interface Person {
        name: string;
        age: number;
    }

    type Flags = {
        option1: boolean;
        option2: boolean;
    }

    type NullablePerson = { [P in keyof Person]: Person[P] | null }
    type PartialPerson = { [P in keyof Person]?: Person[P] }

    const nullablePerson: NullablePerson = { name: 'anonymous', age: 0 };
    nullablePerson.name = 'Tom';
    nullablePerson.age = 37;
    nullablePerson.name = null;
    nullablePerson.age = null;

    const partialPerson: PartialPerson = { name: 'anonymous' };
    partialPerson.name = 'Tom';
    partialPerson.age = 37;
    // partialPerson.name = null;
    // partialPerson.age = null;

    type Nullable<T> = { [P in keyof T]: T[P] | null }
    type Partial<T> = { [P in keyof T]?: T[P] }
    type Readonly<T> = { readonly [P in keyof T]: T[P] }


    const nullablePerson2: Nullable<Person> = { name: 'anonymous', age: 0 };
    nullablePerson2.name = 'Tom';
    nullablePerson2.age = 37;
    nullablePerson2.name = null;
    nullablePerson2.age = null;

    const partialPerson2: Partial<Person> = { name: 'anonymous'};
    partialPerson2.name = 'Tom';
    partialPerson2.age = 37;
    // partialPerson.name = null;
    // partialPerson.age = null;

    const readonlyPerson3: Readonly<Person> = { name: 'anonymous', age: 0 };
    // readonlyPerson3.name = 'Tom';    Error

    // 읽기 전용이면서 partial인 Readonly<Partial<Person>>
    const readonlyPartialPerson: Readonly<Partial<Person>> = { name: 'anonymous' };
})();


(()=>{
    // type Proxy<T> = {
    //     get(): T;
    //     set(value: T): void;
    // }
    // type Proxify<T> = {
    //     [P in keyof T]: Proxy<T[P]>;
    // }
    // function proxify<T>(o: T): Proxify<T> {
    //     // ... wrap proxies ...
    //     const result: Proxify<T> = <Proxy<T>>o;
    //     return result;
    // }
    // let proxyProps = proxify({ ip: '127.0.0.1', name: 'proxy' });


    type Pick<T, K extends keyof T> = {
        [P in K]: T[P];
    }
    type Record<K extends string | number, T> = {
        [P in K]: T;
    }

    type ThreeStringProps = Record<'prop1' | 'prop2' | 'prop3', string>

    let threeStringProps: ThreeStringProps;
    threeStringProps = {
        'prop1': 'str',
        'prop2': 'str2',
        'prop3': 'str3',
    };

    console.log('threeStringProps : ');
    console.dir(threeStringProps);

    type ThreeStringPropsPicked = Pick<ThreeStringProps, 'prop1'>;
    let threeStringPropsPicked: ThreeStringPropsPicked = threeStringProps;

    console.log('threeStringPropsPicked : ');
    console.dir(threeStringPropsPicked);

    // function unproxify<T>(t: Proxify<T>): T {
    //     let result = {} as T;
    //     for (const k in t) {
    //         result[k] = t[k].get();
    //     }
    //     return result;
    // }
    // let originalProps = unproxify(proxyProps);

})();

declare function func<T extends boolean>(x: T): T extends true ? string : number;

// Type is 'string | number
let funcX = func(Math.random() < 0.5)
console.log(funcX);

(()=>{
    type TypeName<T> =
        T extends string ? "string" :
            T extends number ? "number" :
                T extends boolean ? "boolean" :
                    T extends undefined ? "undefined" :
                        T extends Function ? "function" :
                            "object";

    type T0 = TypeName<string>;  // "string"
    type T1 = TypeName<"a">;  // "string"
    type T2 = TypeName<true>;  // "boolean"
    type T3 = TypeName<() => void>;  // "function"
    type T4 = TypeName<string[]>;  // "object"
})();


interface Foo {
    propA: boolean;
    propB: boolean;
}

declare function funcB<T>(x: T): T extends Foo ? string : number;

(()=>{

    function foo<U>(x: U) {
        // Has type 'U extends Foo ? string : number'
        let a = funcB(x);

        // This assignment is allowed though!
        let b: string | number = a;
    }
})();


(()=>{
    var a: string ? string : number = 1;

})();


(()=>{

})();


(()=>{

})();


(()=>{

})();


(()=>{

})();


(()=>{

})();


