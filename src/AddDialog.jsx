import React from 'react'

import { Button, Dialog, DialogContent, TextField, Select, MenuItem, Radio } from '@mui/material'

export default class AddDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            weekCount: '',
            type: 'count',
        }
    }

    componentDidMount() {
        if (this.props.defaults) {
            this.setState(this.props.defaults)
        }
    }

    render() {
        return (
            <Dialog open={true} onClose={this.props.onClose}>
                <DialogContent className='add-dialog'>
                    <b className='centered'>Add Workout</b>
                    <TextField
                        autoComplete='off'
                        fullWidth
                        size='small'
                        variant='outlined'
                        value={this.state.name === null ? '' : this.state.name}
                        placeholder='Name'
                        label='Name'
                        onChange={(ev) => {
                            this.setState({ name: ev.target.value })
                        }}
                    />
                    <TextField
                        autoComplete='off'
                        fullWidth
                        size='small'
                        variant='outlined'
                        value={this.state.weekCount === null ? '' : this.state.weekCount}
                        placeholder='Weekly'
                        label='Weekly'
                        onChange={(ev) => {
                            let val = ev.target.value
                            let radix = 10
                            if (val.startsWith('0x')) {
                                radix = 16
                            }
                            let test = parseInt(val, radix)
                            if (!isNaN(test) || val.length === 0 || radix === 16) {
                                this.setState({ weekCount: val })
                            }
                        }}
                    />
                    <div className='flex-row'>
                        <Radio
                            checked={this.state.type === 'count'}
                            onChange={(ev) => {
                                if (ev.target.checked) {
                                    this.setState({ type: 'count' })
                                }
                            }}
                        />
                        <div className='centered-vertical'>Count</div>
                        <Radio
                            checked={this.state.type === 'time'}
                            onChange={(ev) => {
                                if (ev.target.checked) {
                                    this.setState({ type: 'time' })
                                }
                            }}
                        />
                        <div className='centered-vertical'> Time (minutes)</div>
                    </div>
                    <div className='flex-row'>
                        <Button variant='outlined' onClick={this.props.onClose}>
                            Cancel
                        </Button>
                        <div style={{ marginLeft: 'auto' }} />
                        <Button disabled={this.state.name.length === 0 || this.state.weekCount.length === 0} variant='outlined' onClick={() => {
                            let wc = this.state.weekCount
                            if (typeof (wc) == 'string') {
                                let radix = 10
                                if (this.state.weekCount.startsWith("0x")) {
                                    radix = 16
                                }
                                wc = parseInt(this.state.weekCount, radix)
                            }
                            this.props.onOk(this.state.name, wc, this.state.type)
                            this.props.onClose()
                        }}>
                            Ok
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
}