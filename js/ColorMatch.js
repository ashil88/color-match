/// <reference path="jquery.d.ts" />
class ColorMatchManager {
    constructor(gameWrapper) {
        this.adjacentCellBehaviour = (cellNo) => {
            let cell = this.gridCells.filter('[data-cell-no="' + cellNo + '"]');
            this.changeCellColour(cell);
        };
        this.cellCountLime = gameWrapper.find('#lime');
        this.cellCountOrange = gameWrapper.find('#orange');
        this.currentColor = 'lime';
        this.disableLastCell = false;
        this.gridWrapper = gameWrapper.find('.grid-wrapper');
        this.gridCells = this.gridWrapper.find('.grid-square');
        this.infoWrapper = gameWrapper.find('.info-wrapper');
        this.disableCheckbox = this.infoWrapper.find('#disableLastCell');
        this.msg_error = 'You cannot select the last clicked cell.';
        // toggle whether the last cell can be clicked again
        this.disableCheckbox.on('change', (e) => {
            this.disableLastCell = (e.currentTarget).checked;
        });
        // on click of a grid cell
        this.gridCells.on('click', (e) => {
            this.currentCell = $(e.currentTarget);
            if (this.disableLastCell && this.currentCell.hasClass('disabled')) {
                this.messageController('danger', this.msg_error);
            }
            else {
                this.infoWrapper.find('.alert').fadeOut('slow');
                // disable clicked cell
                this.disableClickedCell();
                // change selected cell colour
                this.changeCellColour(this.currentCell);
                // get adjacent cells
                this.getAdjacentCells(this.currentCell);
                // cell count
                this.updateCellCount();
                // switch player
                this.changePlayer();
            }
        });
    }
    disableClickedCell() {
        this.gridCells.removeClass('disabled');
        this.currentCell.addClass('disabled');
    }
    getAdjacentCells(cell) {
        let selectedCellNo = parseInt(cell.data('cell-no')), adjacentCells = [];
        // ADJACENT CELLS HORIZONTALLY
        if (selectedCellNo % 5 == 0) {
            adjacentCells.push(selectedCellNo - 1);
        }
        else if (selectedCellNo % 5 == 1) {
            adjacentCells.push(selectedCellNo + 1);
        }
        else {
            adjacentCells.push(selectedCellNo - 1, selectedCellNo + 1);
        }
        // ADJACENT CELLS VERTICALLY
        if (selectedCellNo <= 5) {
            adjacentCells.push(selectedCellNo + 5);
        }
        else if (selectedCellNo > 20) {
            adjacentCells.push(selectedCellNo - 5);
        }
        else {
            adjacentCells.push(selectedCellNo - 5, selectedCellNo + 5);
        }
        adjacentCells.forEach((i) => {
            this.adjacentCellBehaviour(i);
        });
    }
    changeCellColour(cell) {
        cell.removeClass(' orange lime').addClass(this.currentColor);
    }
    updateCellCount() {
        let limeCells = this.gridCells.filter('.lime').length, orangeCells = this.gridCells.filter('.orange').length;
        this.cellCountLime.html(limeCells.toString());
        this.cellCountOrange.html(orangeCells.toString());
        // check if there's a winner
        if (limeCells == 25 || orangeCells == 25) {
            this.msg_winner = `Congratulations! ${this.currentColor} has won.`;
            this.messageController('success', this.msg_winner);
        }
    }
    changePlayer() {
        this.currentColor = (this.currentColor == 'lime') ? 'orange' : 'lime';
    }
    messageController(alertType, message) {
        let alertBox = this.infoWrapper.find('.alert');
        if (alertBox.length) {
            alertBox.removeClass('alert-danger alert-success').addClass(`alert-${alertType}`);
            alertBox.html(message).fadeIn('slow');
        }
        else {
            this.infoWrapper.prepend(`<div class="alert alert-${alertType}" role="alert">
    ${message}
</div>`);
            this.infoWrapper.find('.alert').fadeIn('slow');
        }
    }
}
const gameWrapper = $('.game-wrapper');
new ColorMatchManager(gameWrapper);
