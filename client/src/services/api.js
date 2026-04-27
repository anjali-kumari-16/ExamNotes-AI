import axios from "axios"
import { serverUrl } from "../utils/config"
import { setUserData } from "../redux/userSlice"

const getCurrentUser = async (dispatch) => {
    try {
        const resultv = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true })
        console.log(resultv.data)
        dispatch(setUserData(resultv.data))


    } catch (error) {
        console.log(error)

    }

}
export default getCurrentUser
export const generateNotes = async (payload) => {
    try {
        const result = await axios.post(serverUrl + "/api/notes/generate-notes", payload, { withCredentials: true })
        console.log(result.data)
        return result.data


    } catch (error) {
        console.log(error)

    }

}
export const downloadPdf = async (result) => {
    try {
        const response = await axios.post(serverUrl + "/api/pdf/generate-pdf", { result }, {
            responseType: "blob", withCredentials: true
        });
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = "ExamNotesAI.pdf";
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("PDF Download Error:", error);
        throw new Error("Failed to download PDF. The server encountered an issue.");
    }
}