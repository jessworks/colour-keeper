import { AddColorForm } from "../components/color/AddColorForm"
import { ColorList } from "../components/color/ColorList"

export const Colors = () => {
    return (
        <div className="color-page">
            <AddColorForm />
            <ColorList />
        </div>
    )
}