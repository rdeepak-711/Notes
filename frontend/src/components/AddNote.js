import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const AddNote = ({ onClose, refreshNotes, username }) => {
    const [editedTitle, setEditedTitle] = useState("")
    const [editedContent, setEditedContent] = useState()
    const [editedTags, setEditedTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    const handleSave = async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch(`${apiUrl}/notes/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({title: editedTitle, content: editedContent, user: username, tags: editedTags, is_archived: false}),
            });
            if(!response.ok) {
                throw new Error("Failed to update note");
            }
            const updatedNote = await response.json();
            console.log(`Updated Note: ${updatedNote}`);
            onClose();
            refreshNotes();
        } catch (error) {
            setErrorMessage("Error updating note");
            console.error(`Update Error: ${error}`);
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center" onClick={() => { onClose(); refreshNotes(); }}>
            <div className="bg-white w-3/4 md:w-1/2 p-6 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
                <input type="text" className="w-full border rounded-md p-2 text-xl font-bold mb-2 outline-none" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)}/>
                <textarea className="w-full border rounded-md p-2" rows="5" value={editedContent} onChange={(e) => setEditedContent(e.target.value)}/>
                <input className="w-full border rounded-md p-2 outline-none" value={editedTags.join("; ")} onChange={(e) => setEditedTags(e.target.value.split("; "))} placeholder="Enter tags separated by semicolon(;)"/>
                <div className="flex justify-end mt-4 gap-4">
                    <button className="px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={() => handleSave() }>
                        <FontAwesomeIcon icon={faSave} className="text-white cursor-pointer"/> {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddNote;