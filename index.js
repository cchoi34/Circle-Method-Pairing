const namesContainer = document.querySelector(".names-container");
const pairContainer = document.querySelector(".pair-container");
const addNameButton = document.getElementById("add-name-inputs");
const createPairsButton = document.getElementById("create-pairs");
const poolNumber = document.getElementById("pool-number");
const groupOfThreeInput = document.getElementById("group-of-three");

let countGroupsOfThree = {};

const appendPairs = (pairs) => {
    console.log("Three Count: ", countGroupsOfThree);
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

        else if (pair.length === 3 && groupOfThreeInput.checked) {
            let newPair = document.createElement("DIV");
            let html = `
                <h4>
                    ${pair[0]} : ${pair[1]} : ${pair[2]}
                </h4>
            `;
            newPair.innerHTML = html;
            pairContainer.appendChild(newPair);
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

const countingThrees = (key) => {
    if (!countGroupsOfThree[key]) {
        countGroupsOfThree[key] = 1;
    }
    else {
        countGroupsOfThree[key] += 1;
    }
}

const makeGroupOfThree = (firstHalf, secondHalf) => {
    let groupOfThree = [];
    let threeIndex;
    if (secondHalf.length < 3) {
        console.log("Not enough people!");
    }
    for (let i = 0; i < secondHalf.length; i++) {
        if (secondHalf[i] === "BYE" || firstHalf[i] === "BYE") {
            if (secondHalf[i] === "BYE") {
                groupOfThree.push(firstHalf[i]);
                countingThrees(firstHalf[i]);
            }
            else if (firstHalf[i] === "BYE") {
                groupOfThree.push(secondHalf[i]);
                countingThrees(secondHalf[i]);
            }

            if (i !== 1 && i === 0) {
                groupOfThree.push(firstHalf[2]);
                groupOfThree.push(secondHalf[2]);
                countingThrees(firstHalf[2]);
                countingThrees(secondHalf[2]);
                threeIndex = 2;
            }
            else if (i !== 1) {
                groupOfThree.push(firstHalf[1]);
                groupOfThree.push(secondHalf[1]);
                countingThrees(firstHalf[1]);
                countingThrees(secondHalf[1]);
                threeIndex = 1;
            }
            else if (i === 1) {
                groupOfThree.push(firstHalf[0]);
                groupOfThree.push(secondHalf[0]);
                countingThrees(firstHalf[0]);
                countingThrees(secondHalf[0]);
                threeIndex = 0;
            }
        }
    }
    return {groupOfThree, threeIndex};
}

const pairUp = (firstHalf, secondHalf, pairs, counter) => {
    pairs.push(`Round ${counter}`);

    if (groupOfThreeInput.checked) {
        let triple = makeGroupOfThree(firstHalf, secondHalf);
        let pushedGroupOfThree = false;
        for (let i = 0; i < firstHalf.length; i++) {
            let currentPair = [];
            if (i === triple.threeIndex || secondHalf[i] === "BYE" || firstHalf[i] === "BYE") {
                if (!pushedGroupOfThree) {
                    pushedGroupOfThree = true;
                    currentPair = [...triple.groupOfThree];
                    console.log("currentPair of three: ", currentPair);
                }
            }
            else {
                currentPair.push(firstHalf[i]);
                currentPair.push(secondHalf[i]);
            }

            if (currentPair[0]) {
                pairs.push(currentPair);
            }
        }
    }
    else {
        for (let i = 0; i < firstHalf.length; i++) {
            let currentPair = [];

            currentPair.push(firstHalf[i]);
            currentPair.push(secondHalf[i]);
            pairs.push(currentPair);
        }  
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
    let halfIndex = Math.ceil(list.length / 2);
    let firstHalf = list.slice(0, halfIndex);
    let tempSecondHalf = list.slice(halfIndex, list.length);
    let secondHalf = [];
    let counter = 1;

    for (let x = tempSecondHalf.length - 1; x >= 0; x--) { // reversing the order of the second half array
        secondHalf.push(tempSecondHalf[x]);
    }

    if (secondHalf.length < firstHalf.length) {
        secondHalf.push("BYE");
    }

    while (counter < firstHalf.length * 2) {
        pairUp(firstHalf, secondHalf, pairs, counter);
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