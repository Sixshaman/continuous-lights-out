function main() 
{
    const boardSize       = 512;
    const clickRuleSize   = 64;
    const clickRuleRadius = clickRuleSize / 2;

    let canvasBoard    = document.getElementById("CanvasBoard");
    canvasBoard.width  = boardSize;
    canvasBoard.height = boardSize;

    let contextBoard = canvasBoard.getContext("2d");

    let board = new Image();
    board.src = 'board.png';
    board.onload = function() 
    {
        contextBoard.drawImage(this, 0, 0);
    }

    let canvasClickRule    = document.getElementById("CanvasClickRule");
    canvasClickRule.width  = clickRuleSize;
    canvasClickRule.height = clickRuleSize;

    let contextClickRule = canvasClickRule.getContext("2d");

    let clickRule = new Image();
    clickRule.src = 'clickrule.png';
    clickRule.onload = function ()
    {
        contextClickRule.drawImage(this, 0, 0);
    }

    canvasClickRule.hidden = true;

    canvasBoard.onclick = function(e)
    {
        let x = e.pageX - canvasBoard.offsetLeft;
        let y = e.pageY - canvasBoard.offsetTop;

        makeTurn(x, y);
    }

    function makeTurn(x, y)
    {
        let boardLeftBound   = clickRuleRadius;
        let boardTopBound    = clickRuleRadius;
        let boardRightBound  = boardSize - clickRuleRadius;
        let boardBottomBound = boardSize - clickRuleRadius;

        let clickRuleLeftBound   = x < boardLeftBound   ?              clickRuleRadius - x  : 0;
        let clickRuleRightBound  = x > boardRightBound  ? boardSize + (clickRuleRadius - x) : clickRuleSize - 1;
        let clickRuleTopBound    = y < boardTopBound    ?              clickRuleRadius - y  : 0;
        let clickRuleBottomBound = y > boardBottomBound ? boardSize + (clickRuleRadius - y) : clickRuleSize - 1;

        let clickRuleCorrectedWidth  = clickRuleRightBound  - clickRuleLeftBound;
        let clickRuleCorrectedHeight = clickRuleBottomBound - clickRuleTopBound; 

        let boardLeft = x + (clickRuleLeftBound - clickRuleRadius);
        let boardTop  = y + (clickRuleTopBound  - clickRuleRadius);

        let boardRect     = contextBoard.getImageData(boardLeft, boardTop, clickRuleCorrectedWidth, clickRuleCorrectedHeight);
        let clickRuleRect = contextClickRule.getImageData(clickRuleLeftBound, clickRuleTopBound, clickRuleCorrectedWidth, clickRuleCorrectedHeight);

        let imgData = contextBoard.createImageData(clickRuleCorrectedWidth, clickRuleCorrectedHeight);

        for(let i = 0; i < imgData.data.length; i += 4)
        {   
            if(boardRect.data[i] === clickRuleRect.data[i])
            {
                imgData.data[i+0] = 0;
            }
            else
            {
                imgData.data[i+0] = 255;
            }

            imgData.data[i+1] = 0;
            imgData.data[i+2] = 0;
            imgData.data[i+3] = 255;
        }

        contextBoard.putImageData(imgData, boardLeft, boardTop);
    }
}