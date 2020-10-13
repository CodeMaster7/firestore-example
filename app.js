const list = document.querySelector('ul')
const form = document.querySelector('form')

const addRecipe = (recipe) => {
    let time = recipe.created_at.toDate()
    let html = `
        <li>
            <div>${recipe.title}</div>
            <div>created at - ${time}</div>
        </li>
    `
    list.innerHTML += html
}

db.collection('recipes').get().then(snapshot => {
  // console.log(snapshot);
  snapshot.docs.forEach(doc => {
    console.log(doc.data());
    addRecipe(doc.data());
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