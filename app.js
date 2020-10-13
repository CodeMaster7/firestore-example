const list = document.querySelector('ul')
const form = document.querySelector('form')
const button = document.querySelector('button')
const input = document.querySelector('input')

const addRecipe = (recipe, id) => {
    let time = recipe.created_at.toDate()
    let html = `
        <li data-id='${id}'>
            <div>${recipe.title}</div>
            <div>created at - ${time}</div>
            <button class='btn btn-danger btn-sm my-2'>delete</button>
        </li>
    `
    list.innerHTML += html
}

const deleteRecipe = (id) => {
    const recipes = document.querySelectorAll('li')
    recipes.forEach(recipe => {
        if (recipe.getAttribute('data-id') === id) {
            recipe.remove()
        }
    })
}

// get documents from firebase
// onSnapshot return a function and stores it in the variable below
const unsub = db.collection('recipes').onSnapshot(snapshot => { // everytime there is a change in the database fire the callback fuction and send us that new snapshot
    snapshot.docChanges().forEach(change => {
        const doc = change.doc
        if (change.type === 'added') {
            addRecipe(doc.data(), doc.id)
        } else if (change.type === 'removed') {
            deleteRecipe(doc.id)
        }
    })
})

// add and save documents
form.addEventListener('submit', (e) => {
    e.preventDefault()

    // for the created_at value on firebase
    const now = new Date()

    // create object for firebase
    const recipe = {
        title: form.recipe.value, // the recipe is the id on the input field
        created_at: firebase.firestore.Timestamp.fromDate(now)
    }

    // save into database
    db.collection('recipes').add(recipe).then(() => {
        console.log('recipe added');
    }).catch((err) => {
        console.log(err);
    })

    input.value = ''
    input.focus()
})

// deleting data
list.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        console.log(e);
        const id = e.target.parentElement.getAttribute('data-id')
        db.collection('recipes').doc(id).delete().then(() => {
            console.log('recipe deleted');
        })
    }
})

// unsub from database changes
button.addEventListener('click', () => {
    unsub()
    console.log('unsubscribed from collection changes');
})