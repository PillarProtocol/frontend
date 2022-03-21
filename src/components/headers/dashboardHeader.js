import { Component } from 'react';
// import { Grid } from "@material-ui/core";
import { connect } from 'react-redux';
// import { dashboardHeaderStyle } from "./headerStyles";
import classes from './dashboardHeader.module.scss';

// const padding = {
//   padding: "5px 35px 5px 5px",
// };
class DashboardHeader extends Component {
    render() {
        return (
            // <Grid
            //   container
            //   spacing={1}
            //   style={dashboardHeaderStyle}
            //   style={{ marginTop: '10px' }}
            // >
            //   <Grid item xs={12} md={12} lg={12} xl={12} style={padding}>
            //     {this.props.text}
            //   </Grid>
            // </Grid>

            <div className={classes.dashboardHeader}> {this.props.text}</div>
        );
    }
}

const mapStateToProps = (state) => {
    const { wallet, content } = state.walletConnect;
    return { wallet, content };
};

const connectedDashboardHeader = connect(mapStateToProps)(DashboardHeader);

export { connectedDashboardHeader as DashboardHeader };
