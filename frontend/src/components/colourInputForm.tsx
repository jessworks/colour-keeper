export const ColorInputForm = () => {
    return (
        <>
            <form>
                <label htmlFor="image-path">Upload Image</label>
                <input type="file" id="image-path" name="image-path"></input>

                <label htmlFor="color-name">Colour Name</label>
                <input type="text" id="color-name" name="color-name"></input>

                <label htmlFor="color-medium">Colour Medium</label>
                <input type="text" id="color-name" name="color-name"></input>

                <label htmlFor="manufacturer">Manufacturer</label>
                <input type="text" id="manufacturer" name="manufacturer"></input>

                <label htmlFor="color-family">Colour Family</label>
                <input type="text" id="color-family" name="color-family"></input>

                <label htmlFor="Tags">Tags</label>
                <input type="text" id="tags" name="tags"></input>

                <label htmlFor="quantity">Quantity</label>
                <input type="number" id="quantity" name="quantity"></input>

                <button type="submit">Add Colour</button>
                
            </form>
        </>
    )
}