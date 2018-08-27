import DropZoneDialog from '../../src';
import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme();

export default class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openUploadModal: false,
            files: [],
        };
    }

    closeDialog() {
        this.setState({openUploadModal: false});
    }

    saveFiles(files) {
        //Saving files to state for further use and closing Modal.
        this.setState({files: files, openUploadModal: false});
    }

    handleOpenUpload() {
        this.setState({
            openUploadModal: true,
        });
    }

    deleteFile(fileName) {
        this.props.deleteFile(fileName);
    }

    render() {
        //If we already saved files they will be shown again in modal preview.
        let files = this.state.files;
        let style = {
            addFileBtn: {
                'marginTop': '15px',
            },
        };

        return (<MuiThemeProvider theme={theme}>
                <div>
                    <Button style={style.addFileBtn} variant="contained" 
                                  onClick={this.handleOpenUpload.bind(this)}>Add Image</Button>
                    <DropZoneDialog
                        open={this.state.openUploadModal}
                        saveFiles={this.saveFiles.bind(this)}
                        deleteFile={this.deleteFile.bind(this)}
                        acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                        files={files}
                        showPreviews={true}
                        maxSize={5000000}
                        closeDialog={this.closeDialog.bind(this)}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}
