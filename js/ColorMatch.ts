/// <reference path="jquery.d.ts" />

class ColorMatchManager {

    private cellCountLime: JQuery;
    private cellCountOrange: JQuery;
    private currentCell: JQuery;
    private currentColor: string;
    private gridWrapper: JQuery;
    private gridCells: JQuery;
    private infoWrapper: JQuery;
    private msg_error: string;
    private msg_winner: string;

    constructor(gameWrapper: JQuery) {
        this.cellCountLime = gameWrapper.find('#lime');
        this.cellCountOrange = gameWrapper.find('#orange');
        this.currentColor = 'lime';
        this.gridWrapper = gameWrapper.find('.grid-wrapper');
        this.gridCells = this.gridWrapper.find('.grid-square');
        this.infoWrapper = gameWrapper.find('.info-wrapper');
        this.msg_error = 'You cannot select the last clicked cell.';

        this.gridCells.on('click', (e) => {
            this.currentCell = $(e.currentTarget);

            if (this.currentCell.hasClass('disabled')) {
                this.messageController('danger', this.msg_error);
            } else {
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

    private disableClickedCell() {
        this.gridCells.removeClass('disabled');

        this.currentCell.addClass('disabled');
    }

    private getAdjacentCells(cell: JQuery) {
        let selectedCellNo = parseInt(cell.data('cell-no')),
            adjacentCells = [];

        // ADJACENT CELLS HORIZONTALLY
        if (selectedCellNo % 5 == 0) {  // end of row
            adjacentCells.push(selectedCellNo - 1);
        } else if (selectedCellNo % 5 == 1) { // beginning of row
            adjacentCells.push(selectedCellNo + 1);
        } else { // middle of row
            adjacentCells.push(selectedCellNo - 1, selectedCellNo + 1);
        }

        // ADJACENT CELLS VERTICALLY
        if (selectedCellNo <= 5) { // first row
            adjacentCells.push(selectedCellNo + 5);
        } else if (selectedCellNo > 20) {  // last row
            adjacentCells.push(selectedCellNo - 5);
        } else { // middle rows
            adjacentCells.push(selectedCellNo - 5, selectedCellNo + 5);
        }

        adjacentCells.forEach((i) => {
            this.adjacentCellBehaviour(i);
        });
    }

    private adjacentCellBehaviour = (cellNo: number) => {
        let cell = this.gridCells.filter('[data-cell-no="' + cellNo + '"]');

        this.changeCellColour(cell);
    };

    private changeCellColour(cell: JQuery) {
        cell.removeClass(' orange lime').addClass(this.currentColor);
    }

    private updateCellCount() {
        let limeCells = this.gridCells.filter('.lime').length,
            orangeCells = this.gridCells.filter('.orange').length;

        this.cellCountLime.html(limeCells.toString());
        this.cellCountOrange.html(orangeCells.toString());

        // check if there's a winner
        if (limeCells == 25 || orangeCells == 25) {
            this.msg_winner = `Congratulations! ${this.currentColor} has won.`;
            this.messageController('success', this.msg_winner);
        }
    }

    private changePlayer() {
        this.currentColor = (this.currentColor == 'lime') ? 'orange' : 'lime';
    }

    private messageController(alertType: string, message: string) {
        let alertBox = this.infoWrapper.find('.alert');

        if (alertBox.length) { // box exists
            alertBox.removeClass('alert-danger alert-success').addClass(`alert-${alertType}`);
            alertBox.html(message);
        } else {    // box doesn't exist
            this.infoWrapper.prepend(`<div class="alert alert-${alertType}" role="alert">
    ${message}
</div>`);
            this.infoWrapper.find('.alert').fadeIn('slow');
        }
    }

}

const gameWrapper: JQuery = $('.game-wrapper');
new ColorMatchManager(gameWrapper);