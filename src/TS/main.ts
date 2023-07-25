let Name: string;

let textField = <HTMLInputElement>document.getElementById("textField");
let hi = document.createElement("h2");

if (textField) {
  textField.addEventListener("keypress", (enter) => {
    if(enter.key == "Enter")
    Name = textField.value;
    else
    Name = ""
    hi.innerHTML = "Cao Najveci " + Name;
  });
}

let bdy = document.querySelector("body");

if (bdy) bdy.appendChild(hi);
