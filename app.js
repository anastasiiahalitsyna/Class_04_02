
document.getElementById("student-form").onsubmit = function (e) {
    e.preventDefault();
    const form = e.target;
    const formFields = form.elements;
    let validationErrors = validateFormInput(formFields);
    if (validationErrors && validationErrors.length > 0) {
        //   document.getElementById('errors').textContent = '';
        //   validationErrors.forEach(err => {
        //     var errorDiv = document.createElement("div");
        //     errorDiv.classList.add('error');
        //     errorDiv.innerText = err;
        //     document.getElementById('errors').appendChild(errorDiv);
        //   });
        //   document.getElementById("errors").classList.remove('invisible');
        console.log('validation error');
    } else {
        // show data and success
        //   form.classList.add('invisible');
        //   document.getElementById("result-container").classList.remove('invisible');
        //   document.getElementById("errors").classList.add('invisible');

        fillResultData(formFields);
    }
    // returning false preventing the form from the default submit flow
    return false;
};



function fillResultData(formFields) {
    console.log(formFields);
    const { type, firstName, surname, year, studentId, test1, test2, test3, homework } = formFields;
    var averageMark = calculateAverage(test1.value, test2.value, test3.value, homework.value);
    var averageMarkAsLetter = parseToLetterMark(averageMark);

    var resultText = `Student studiów trybu: ${type.value} ${firstName.value} ${surname.value} (${year.value})
     o id: ${studentId.value} otrzymał z testu1 ${test1.value} punktów, 
    z testu2 ${test2.value} punktów, z testu3: ${test3.value} punktów, z prac domowych: ${homework.value} punktów - 
    co daje średnią ${averageMarkAsLetter}`;

    document.getElementById("result").innerText = resultText;
    const studentData = {
        studentId: studentId.value,
        firstName: firstName.value,
        surname: surname.value,
        type: type.value,
        averageMarkAsLetter,
    };
    saveCSV(studentData);
}

function calculateAverage(test1, test2, test3, homework) {
    let testAvg = ((parseInt(test1) + parseInt(test2) + parseInt(test3)) * 8) / 30;
    console.log(testAvg);
    testAvg += parseInt(homework) / 10;
    console.log(testAvg);

    testAvg += 10;
    console.log(testAvg);


    return testAvg;
}

function parseToLetterMark(mark) {
    if (mark > 80) {
        return 'A';
    } else if (mark > 60) {
        return 'B';
    } else if (mark > 40) {
        return 'C';
    } else if (mark > 20) {
        return 'D';
    } else {
        return 'F';
    }
}

function validateFormInput(formFields) {
    const firstName = formFields.firstName.value;
    const surname = formFields.surname.value;
    const email = formFields.email.value;
    let errors = [];

    if (!validateNameSurname(firstName)) {
        errors.push('First Name field is invalid');
    }
    if (!validateNameSurname(surname)) {
        errors.push('Surname field is invalid');
    }
    if (!validateEmail(email)) {
        errors.push('Email field is invalid');
    }
    return errors;
}
function validateNameSurname(name) {
    var regName = /^[a-zA-Z\s-]*$/;
    return name && regName.test(name);
}

function validateEmail(email) {
    var regName = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return email && regName.test(email);
}



async function saveCSV(studentData) {
    // (A) ARRAY OF DATA
    var array = [];
    var line = [];
    for (const key in studentData) {
        if (studentData.hasOwnProperty(key)) {
            line.push(studentData[key]);
        }
    }
    array.push(line);
    console.log(array);
    // (B) CREATE BLOB OBJECT
    var blob = new Blob([CSV.serialize(array)], { type: "text/csv" });

    // (C) FILE HANDLER & FILE STREAM
    const fileHandle = await window.showSaveFilePicker({
        suggestedName: "student-grade.csv",
        types: [{
            description: "CSV file",
            accept: { "text/csv": [".csv"] }
        }]
    });
    const fileStream = await fileHandle.createWritable();

    // (D) WRITE CSV FILE
    await fileStream.write(blob);
    await fileStream.close();
}