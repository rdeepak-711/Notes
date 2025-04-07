import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxArchive, faEdit, faFileArrowDown, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";

const SelectedNote = ({ note, isEditing, onEdit, onSave, onClose, refreshNotes, deleteNote }) => {
    const [editedTitle, setEditedTitle] = useState(note.title)
    const [editedContent, setEditedContent] = useState(note.content)
    const [editedTags, setEditedTags] = useState(note.tags || []);
    const [loading, setLoading] = useState(false);
    const [isArchive, setIsArchive] = useState(note.is_archived)
    const [errorMessage, setErrorMessage] = useState("")

    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    const handleSave = async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch(`${apiUrl}/notes/${note._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({title: editedTitle, content: editedContent, tags: editedTags, is_archived: isArchive}),
            });
            if(!response.ok) {
                throw new Error("Failed to update note");
            }
            const updatedNote = await response.json();
            console.log(`Updated Note: ${updatedNote}`);
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
                {isEditing ? (
                    <input type="text" className="w-full border rounded-md p-2 text-xl font-bold mb-2 outline-none" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)}/>
                ) : (
                    <h2 className="text-xl font-bold mb-2">{editedTitle}</h2>
                )}
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Created: {new Date(note.created_at).toLocaleString()}</span>
                    <span>Updated: {new Date(note.updated_at).toLocaleString()}</span>
                </div>
                {isEditing ? (
                    <textarea className="w-full border rounded-md p-2" rows="5" value={editedContent} onChange={(e) => setEditedContent(e.target.value)}/>
                ) : (
                    <p className="text-gray-700">{editedContent}</p>
                )}

                {isEditing ? (
                    <input className="w-full border rounded-md p-2 outline-none" value={editedTags.join("; ")} onChange={(e) => setEditedTags(e.target.value.split("; "))} placeholder="Enter tags separated by semicolon(;)"/>
                ):(
                    <div className="flex flex-wrap gap-2">
                        {editedTags.map((tag,index)=>{
                            return (
                                <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                                    {tag} 
                                </span>
                            )
                        })}
                    </div>
                )}

                <div className="flex justify-end mt-4 gap-4">
                    {isEditing ? (
                        <button className="px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={() => {onSave(); handleSave(); }}>
                            <FontAwesomeIcon icon={faSave} className="text-white cursor-pointer mr-2"/> {loading ? "Saving..." : "Save"}
                        </button>
                    ) : (
                        <button className="px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={onEdit}>
                            <FontAwesomeIcon icon={faEdit} className="text-white cursor-pointer mr-2"/> Edit
                        </button>
                    )}
                    {isArchive ? (
                        <button className="px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700" onClick={() => { setIsArchive(true); onSave(); handleSave(); }}>
                            <FontAwesomeIcon icon={faFileArrowDown} className="text-white cursor-pointer mr-2"/> Archived
                        </button>
                    ) : (
                        <button className="px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700" onClick={() => { setIsArchive(true); onSave(); handleSave(); }}>
                            <FontAwesomeIcon icon={faBoxArchive} className="text-white cursor-pointer mr-2"/> Archive
                        </button>
                    )}
                    <button className="px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700" onClick={() => { deleteNote(); onClose(); refreshNotes(); }}>
                        <span>
                            <FontAwesomeIcon icon={faTrash} className="text-white cursor-pointer mr-2"/>
                                Delete
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SelectedNote;