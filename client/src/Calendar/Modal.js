import ReactDOM from "react-dom";

const Modal = ({children, handleClose}) => { 
   
    return ReactDOM.createPortal(( 
        <div className="modal-backdrop">
            <div className="modal">
                {children}                
                <button className="modalClose" onClick={handleClose}><i className="fa-solid fa-xmark"></i></button>
            </div>
            
        </div>
     ), document.body);
}
 
export default Modal;