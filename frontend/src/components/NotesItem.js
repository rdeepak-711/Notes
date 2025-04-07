import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const NotesItem = ({note, truncateContent, setSelectedNote, setIsEditing, deleteNote }) => {
    return (
        <div key={note._id} className="w-full p-4 bg-gray-100 rounded-md shadow-md mb-4 flex flex-col">
            <h3 className="text-lg font-semibold">{note.title}</h3>
            <div className="flex justify-between text-sm text-gray-500">
                <span>Created: {new Date(note.created_at).toLocaleString()}</span>
                <span>Updated: {new Date(note.updated_at).toLocaleString()}</span>
            </div>
            <p className="text-gray-600 mt-2">{truncateContent(note.content, note)}</p>
            <div className="flex justify-between items-center mt-3">
                <div className="flex gap-2 flex-wrap">
                    {note.tags.map((tag, index) => {
                        return (
                            <span key={index} className="bg-blue-200 text-blue-700 px-2 py-1 rounded-full text-xs">
                                {tag}
                            </span>
                        )
                    })}
                </div>
                <div className="flex gap-4">
                    <FontAwesomeIcon icon={faEdit} className="text-gray-600 cursor-pointer" onClick={() => { setSelectedNote(note); setIsEditing(true); }}/>
                    <FontAwesomeIcon icon={faTrash} className="text-gray-600 cursor-pointer" onClick={() => deleteNote()}/>
                </div>
            </div>
        </div>
    )
}

export default NotesItem;