import { translation } from "../../visual-editor";

export function SidebarFooter() {
    return (
        <div className='flex w-full justify-end flex-shrink-0 p-2 border-t border-dark/10'>
            <button type='submit' className=' btn btn-primary'>
                {translation("save")}
            </button>
        </div>
    );
}
