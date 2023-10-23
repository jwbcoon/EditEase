import {useState, useEffect} from 'react';
import DropZone from '../components/DropZone';
import SideNav from '../menu/SideNav';
import API from '../API_Interface/API_Interface.js';

// Note: console.log(JSON.stringify(data)) will always return empty even when data is there.
// Specify a key name like "name" within a file object and the data will present itself.
// https://stackoverflow.com/questions/11573710/event-datatransfer-files-is-empty-when-ondrop-is-fired
const handleFiles = (data, setEdit) => {
    console.log(`handling files! ${JSON.stringify(data[0].name)}`);
    //if (edit !== undefined) console.log(`edit has data! ${JSON.stringify(edit)}`);
    //setEdit({...data[0]});
}

export default function EditEase(props) {
  const [edit, setEdit] = useState(undefined);
  
  /*useEffect(() => {
      const api = new API();

      async function postUserOriginalImage() {
          const postJSONResponse = await api.postUserOriginalImage(1);
          console.log(`Response from post to database::postUserOriginalImage: ${JSON.stringify(postJSONResponse)}`);
          //setEdit(postJSONResponse.data[0]);
      }

      postUserOriginalImage();
  }, [edit])*/

	return (
		<div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <SideNav/>
        <div style={{ width: '100vw', height: '100%', position: 'absolute', top: '25%', left: 0, transform: 'translateX(25%)' }}>
            <DropZone setEdit={setEdit} handleFiles={handleFiles}/>
        </div>
		</div>
	);
}

