import fs from 'fs';

export default function doWrite() {
    const content = 'Some content!';
    fs.writeFile('user_data.json', content, err => {
    if (err) {
    console.error(err);
  } else {
    // file written successfully
  }
});
}


export default function doWrite() {
    const content = 'Some content!';
    fs.writeFile('pieteikties_data.json', content, err => {
    if (err) {
    console.error(err);
  } else {
    // file written successfully
  }
});
}