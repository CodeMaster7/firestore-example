const list = document.querySelector('ul')
const form = document.querySelector('form')

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
// get documents from firebase
db.collection('recipes').get().then(snapshot => {
  // console.log(snapshot);
  snapshot.docs.forEach(doc => {
    console.log(doc.data());
    console.log(doc.id);

    addRecipe(doc.data(), doc.id);
  });
}).catch(err => {
  console.log(err);
});

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