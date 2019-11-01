const namesContainer = document.querySelector(".names-container");
const pairContainer = document.querySelector(".pair-container");
const addNameButton = document.getElementById("add-name-inputs");
const createPairsButton = document.getElementById("create-pairs");
const poolNumber = document.getElementById("pool-number");

const appendPairs = (pairs) => {
    pairs.forEach((pair) => {
        if (!Array.isArray(pair)) {
            let newRound = document.createElement("DIV");
            let roundHTML = `
                <br />
                <h3> ${pair} </h3>
                <hr />
            `;
            newRound.innerHTML = roundHTML;
            pairContainer.appendChild(newRound);
        }
        else {
            let newPair = document.createElement("DIV");
            let html = `
                <h4>
                    ${pair[0]} : ${pair[1]}
                </h4>
            `;
            newPair.innerHTML = html;
            pairContainer.appendChild(newPair);
        }
    })
}

const pairUp = (firstHalf, secondHalf, pairs) => {
    pairs.push("New Round");
    for (let i = 0; i < firstHalf.length; i++) {
        let currentPair = [];    
        currentPair.push(firstHalf[i]);
        currentPair.push(secondHalf[i]);
        pairs.push(currentPair);
    }  
}

const rotate = (firstHalf, secondHalf) => {
    let firstCopy = [...firstHalf];
    let secondCopy = [...secondHalf];

    for (let i = 0; i < firstHalf.length; i++) {
        if (i === 0) {
            firstCopy[0] = firstHalf[i]; // the first index will not rotate
        }

        else if (i === firstHalf.length - 1) {
            secondCopy[i] = firstHalf[i];
        }

        else {
            firstCopy[i + 1] = firstHalf[i]; // this is to ensure that while the copy is being made, the correct values are rotating around
        }
    }

    for (let j = secondHalf.length - 1; j >= 0; j--) {
        if (j === 0) {
            firstCopy[j + 1] = secondHalf[j];
            // firstCopy[1] = secondHalf[0] : this is rotating the first index of the second half to the second position of the first half
        }
        else {
            secondCopy[j - 1] = secondHalf[j]; 
        }
    }
    return [firstCopy, secondCopy];
}

const createPairs = (list) => {
    let pairs = [];
    let halfIndex = Math.floor(list.length / 2);
    let firstHalf = list.slice(0, halfIndex);
    let tempSecondHalf = list.slice(halfIndex, list.length);
    let secondHalf = [];
    let counter = 1;

    for (let x = tempSecondHalf.length - 1; x >= 0; x--) { // reversing the order of the second half array
        secondHalf.push(tempSecondHalf[x]);
    }

    while (counter < list.length) {
        pairUp(firstHalf, secondHalf, pairs);
        let newRound = rotate(firstHalf, secondHalf);
        firstHalf = newRound[0];
        secondHalf = newRound[1];
        counter += 1;
    }
    appendPairs(pairs);

}


const createNames = () => {
    const inputContainer = document.createElement("DIV");
    inputContainer.className = "input-container";
    const html = `
        <input class="name" type="text">
    `;
    inputContainer.innerHTML = html;
    namesContainer.appendChild(inputContainer);
}

const clearInputs = () => {
    namesContainer.innerHTML = '';
}

const clearPairs = () => {
    pairContainer.innerHTML = '';
}

const enterPoolSize = (number) => {
    clearInputs();
    for(let i = 0; i < number; i++) {
        createNames();
    }
}

const getAllNames = () => {
    let classNameCollection = document.getElementsByClassName("name");
    let allNamesCollection = Array.from(classNameCollection);
    let allNames = allNamesCollection
        .map((element) => {
            return element.value;
        })
        .filter((name) => {
            return name !== "";
        })
    createPairs(allNames);
}

addNameButton.addEventListener("click", () => {
    enterPoolSize(poolNumber.value);
})

createPairsButton.addEventListener("click", () => {
    clearPairs();
    getAllNames();
})