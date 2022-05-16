
/**
pre-requisites:
- Jquery is installed
- slider controls are classnamed 'slider-arrow'
- slider controls have a data attr named 'data-dir'; prev is -1 and next is 1
- all slides have classname 
*/

class CssSlider {
    scrollIterator = 0;
    scrollCount; //
    container;
    padding;

    constructor(container, options ={}) {
        this.container = $(container)

        this.padding = options.padding ?? 30;
        this.scrollCount = options.scrollCount ?? 3;

        //hardcode force count to 1 for mobile
        if(window.matchMedia("(max-width: 600px)").matches) {
            this.scrollCount = 1;
        }
        this.slideBtnHandler()
    }

    reset() {
        this.scrollIterator = 0;
        const slides = that.container.find(".slider-card")

        this.scrollToTarget(slides)
    }

    slideBtnHandler() {
        const that = this


        $(this.container).find(".slider-arrow").on("click", function() {
            const slides = that.container.find(".slider-card")
            that.getCurSlide(slides)

            const dir = parseInt( $(this).data("dir") )
            if(dir < 0) {
                that.scrollIterator -= that.scrollCount
            } else {
                that.scrollIterator += that.scrollCount
            }

            that.scrollToTarget(slides)
        })
    }

    scrollToTarget(slides) {
        const targetTile = slides[ clamp(this.scrollIterator, 0, slides.length - 1) ]
        smoothScrollTo(targetTile, {block: "nearest", inline: "start"})
    }

    getCurSlide(slides) {
        let i = 0

        for(const item of slides) {
            const posLeft = $(item).position().left
            const width = this.container.width() / this.scrollCount

            if( (posLeft + width) > this.padding && (posLeft + width) < (width + this.padding) ) {
                this.scrollIterator = i
                return item
            }
            i++
        }
    }
}
