import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Dropzone from 'react-dropzone';

import ActionDelete from '@material-ui/icons/Clear';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import './index.css';
import {isImage} from './helpers/helpers.js';

export default class MaterialDropZone extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            openSnackBar: false,
            errorMessage: '',
            files: this.props.files || [],
            disabled: true,
            acceptedFiles: this.props.acceptedFiles ||
            ['image/jpeg', 'image/png', 'image/bmp', 'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            open: nextProps.open,
            files: nextProps.files,
        });
    }

    handleClose() {
        this.props.closeDialog();
        this.setState({open: false});
    }

    onDrop(files) {
        let oldFiles = this.state.files;
        const filesLimit = this.props.filesLimit || '3';

        oldFiles = oldFiles.concat(files);
        if (oldFiles.length > filesLimit) {
            this.setState({
                openSnackBar: true,
                errorMessage: 'Cannot upload more then ' + filesLimit + ' items.',
            });
        } else {
            this.setState({
                files: oldFiles,
            }, this.changeButtonDisable);
        }
    }

    handleRemove(file, fileIndex) {
        const files = this.state.files;
        // This is to prevent memory leaks.
        window.URL.revokeObjectURL(file.preview);

        files.splice(fileIndex, 1);
        this.setState(files, this.changeButtonDisable);

        if (file.path) {
            this.props.deleteFile(file);
        }
    }

    changeButtonDisable() {
        if (this.state.files.length !== 0) {
            this.setState({
                disabled: false,
            });
        } else {
            this.setState({
                disabled: true,
            });
        }
    }

    saveFiles() {
        const filesLimit = this.props.filesLimit || '3';

        if (this.state.files.length > filesLimit) {
            this.setState({
                openSnackBar: true,
                errorMessage: 'Cannot upload more then ' + filesLimit + ' items.',
            });
        } else {
            this.props.saveFiles(this.state.files);
        }
    }

    onDropRejected() {
        this.setState({
            openSnackBar: true,
            errorMessage: 'File too big, max size is 3MB',
        });
    }

    handleRequestCloseSnackBar = () => {
        this.setState({
            openSnackBar: false,
        });
    };

    render() {
        let img;
        let previews = '';
        const fileSizeLimit = this.props.maxSize || 3000000;

        if (this.props.showPreviews === true) {
            previews = this.state.files.map((file, i) => {
                const path = file.preview || '/pic' + file.path;

                if (isImage(file)) {
                    //show image preview.
                    img = <img className="smallPreviewImg" src={path}/>;
                } else {
                    //Show default file image in preview.
                    img = <FileIcon className="smallPreviewImg"/>;
                }

                return (<div key={i}>
                    <div className={'imageContainer col fileIconImg'} key={i}>
                        {img}
                        <div className="middle">
                            <IconButton>
                                <ActionDelete
                                    className="removeBtn"
                                    onClick={this.handleRemove.bind(this, file, i)}
                                />
                            </IconButton>
                        </div>
                    </div>
                </div>);
            });
        }

        return (
            <div>
                <Dialog                     
                    open={this.state.open}
                    onClose={this.handleClose.bind(this)}
                    scroll="body"
                    aria-labelledby="upload-dialog-title"
                >
                    <DialogTitle id="upload-dialog-title">Upload File</DialogTitle>
                    <DialogContent>
                        <Dropzone
                            accept={this.state.acceptedFiles.join(',')}
                            onDrop={this.onDrop.bind(this)}
                            className={'dropZone'}
                            acceptClassName={'stripes'}
                            rejectClassName={'rejectStripes'}
                            onDropRejected={this.onDropRejected.bind(this)}
                            maxSize={fileSizeLimit}
                        >
                            <div className={'dropzoneTextStyle'}>
                                <p className={'dropzoneParagraph'}>{'Drag and drop an image file here or click'}</p>
                                <br/>
                                <CloudUploadIcon className={'uploadIconSize'}/>
                            </div>
                        </Dropzone>
                        <br/>
                        <div className="row">
                            {this.state.files.length ? <span>Preview:</span> : ''}
                        </div>
                        <div className="row">
                            {previews}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="outlined"                 
                            color="secondary"
                            onClick={this.handleClose.bind(this)}
                        >Cancel</Button>,
                        <Button
                            variant="outlined"                 
                            color="primary"
                            disabled={this.state.disabled}
                            onClick={this.saveFiles.bind(this)}
                        >Submit</Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    open={this.state.openSnackBar}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onClose={this.handleRequestCloseSnackBar}
                />
            </div>
        );
    }
}
