var db = firebase.firestore();

async function getAllItems() {
    const out = []
    const querySnapshot = await db.collection("items").get()
    querySnapshot.forEach((doc) => {
        const data = doc.data()
        out.push({
            Title: data.title,
            Body: data.body,
            Id: doc.id,
        })
        console.log(`${doc.id} => `, doc.data());
    });
    console.log(out)
    return out
}

async function getItemById(id) {
    const doc = await db.collection("items").doc(id).get();
    const data = doc.data()
    return {
        Title: data.title,
        Body: data.body,
        Id: doc.id,
    }
}

async function createItem(item) {
    const doc = await db.collection("items").add(item)
    const id = doc.id;
    return getItemById(id)
}
