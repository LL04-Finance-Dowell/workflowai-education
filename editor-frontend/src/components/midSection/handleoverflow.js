export const handleHolderDivOverFlow = (holderDiv) => {
    const holderDivs = document.querySelectorAll('.holderDIV');
    const midsection = document.querySelectorAll('#midSection_container')[0];
    let newWidth = holderDiv.scrollWidth + 2; //2= padding
    let newHeight = holderDiv.scrollHeight + 2; //2= padding


    holderDivs.forEach(otherDiv => {
        if (holderDiv !== otherDiv) {
            const otherHolderRect = otherDiv.getBoundingClientRect();
            const currentHolderRect = holderDiv.getBoundingClientRect();
            const topDifference = Math.abs(currentHolderRect.top - otherHolderRect.bottom);
            const leftDifference = Math.abs(currentHolderRect.left - otherHolderRect.right);
            const rightDifference = Math.abs(currentHolderRect.right - otherHolderRect.left);
            const bottomDifference = Math.abs(currentHolderRect.bottom - otherHolderRect.top);
            if (topDifference < 5) {
                newHeight = holderDiv.offsetHeight + bottomDifference - 5;
                console.log("\n\n\nTOP DIFFERENCE", topDifference, 'for:', otherDiv, "NEW HEIGHT", newHeight);
                holderDiv.style.height = newHeight + "px";
            }
            if (leftDifference < 5) {
                newWidth = holderDiv.offsetWidth - rightDifference - 5;
                console.log("\n\n\nLEFT DIFFERENCE", leftDifference, 'for:', otherDiv, "NEW WIDTH", newWidth);
                holderDiv.style.width = newWidth + "px";
            }
            if (rightDifference < 5) {
                newWidth = holderDiv.offsetWidth + rightDifference - 5;
                console.log("\n\n\nRIGHT DIFFERENCE", rightDifference, 'for:', otherDiv, "NEW WIDTH", newWidth);
                holderDiv.style.width = newWidth + "px";
                // holderDIV.style.width = 'auto'
            }
            if (bottomDifference < 5) {
                newHeight = holderDiv.offsetHeight - bottomDifference - 5;
                console.log("\n\n\nBOTTOM DIFFERENCE", bottomDifference, 'for:', otherDiv, "NEW HEIGHT", newHeight);
                holderDiv.style.height = newHeight + "px";
            }
        }
    });

}