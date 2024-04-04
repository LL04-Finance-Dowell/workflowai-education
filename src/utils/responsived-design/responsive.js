export const maintainRatio = (parent, child) => {
    // Get the initial sizes of the parent and child
    const initialParentWidth = parent.offsetWidth;
    const initialParentHeight = parent.offsetHeight;
    const initialChildWidth = child.offsetWidth;
    const initialChildHeight = child.offsetHeight;

    // Calculate the initial aspect ratio of the child
    const initialChildRatio = initialChildWidth / initialChildHeight;

    // Calculate the new width and height of the child to maintain the initial ratio
    let newChildWidth, newChildHeight;

    if (initialParentWidth / initialParentHeight > initialChildRatio) {
        newChildWidth = initialParentHeight * initialChildRatio;
        newChildHeight = initialParentHeight;
    } else {
        newChildWidth = initialParentWidth;
        newChildHeight = initialParentWidth / initialChildRatio;
    }

    // Assign the new width to the child
    child.style.width = `${newChildWidth}px`;
    return {
        width: newChildWidth,
        height: newChildHeight
    };
}

export const handleResize = (entries) => {
    // entries.forEach(entry => {
    //     if (!document.querySelector('.preview-canvas')) {
    //         const parent = entry.target;
    //         const children = parent.getElementsByClassName('holderDV');
    //         console.log("\nSCALING:\n", parent, "\n")
    //         Array.from(children).forEach(child => {
    //             console.log(maintainRatio(parent, child));
    //             console.log("\nSCALING:\n", child, "\n")
    //         });
    //     } else {
    //         const parent = entry.target;
    //         const children = parent.getElementsByClassName('holderDV');
    //         Array.from(children).forEach(child => {
    //             maintainRatio(parent, child);
    //         });
    //     }

    // });
}


export const resizePreview = () => {
    document.querySelectorAll('.main-section-container-preview')?.forEach(elem=>elem?.remove());
    const editSec = document.querySelector('.editSec_midSec');
    const previewContainer = document.createElement('div');
    previewContainer.id = 'main-section-container';
    previewContainer.className = 'main-section-container-preview';
    editSec.append(previewContainer);
    const midSecAll = document.querySelectorAll('.midSection_container');
    midSecAll.forEach((mid) => {
        const previewCanvas = mid.cloneNode(true);
        previewCanvas.style.width = '158mm';
        const scale = 600 / 794;
        previewCanvas.querySelectorAll('.holderDIV')?.forEach((div) => {
            const divWidth = +div.style.width.split('px')[0];
            const currentLeft = +div.style.left.split('px')[0] || 0;
            div.style.left = (currentLeft * scale) + 'px';
            div.style.width = (divWidth * scale) + 'px';
            div.style.border = 'none';
            div.style.pointerEvents = 'none';
        });
        previewCanvas.className = 'midSection_container print_container preview-canvas';
        document.querySelector('#main-section-container').append(previewCanvas);
    });
}