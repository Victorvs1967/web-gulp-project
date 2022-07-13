class Person {
  
  constructor(
    private name: string,
    private age: number,
    private salary: number
  ) {}

  public toString(): string {
    return `Name: ${this.name}\nAge: ${this.age}\nSalary: ${this.salary}`;
  }
}

const admin = new Person('Victor', 55, 2000);
const user = new Person('Natasha', 52, 2000);
console.log(admin.toString());
console.log(user.toString());