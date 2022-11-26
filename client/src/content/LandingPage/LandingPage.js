import React from 'react';
import {InfoSection, InfoCard} from '../../components/Info';
import {Globe, Application, IbmCloudVpcEndpoints} from '@carbon/react/icons';

import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Grid,
    Column,
} from '@carbon/react';


const LandingPage = () => {

    const startServer = event => {
        fetch('http://localhost:3001/start-search').then(()=>
            console.log("started")
        )
        event.currentTarget.disabled = true;
        event.currentTarget.textContent = "Started"
    };

    return (
        <Grid className="landing-page" fullWidth>
            <Column lg={16} md={8} sm={4} className="landing-page__banner">
                <Breadcrumb noTrailingSlash>
                    <BreadcrumbItem>
                        <a href="https://www.ibm.com/cloud/event-streams">Getting started</a>
                    </BreadcrumbItem>
                </Breadcrumb>
            </Column>
            <Column lg={16} md={8} sm={4} className="landing-page__r2">
                <Grid className="tabs-group-content">
                    <Column md={4} lg={7} sm={4} className="landing-page__tab-content">
                        <h2 className="landing-page__subheading">IBM Event Streams</h2>
                        <p className="landing-page__p">
                            Built on open source Apache Kafka, IBM Event Streams is an event-streaming
                            platform that helps you build smart applications that can react to events as they happen.
                            IBM Event Streams is based on years of operational expertise IBM has gained from running
                            Apache Kafka event streams for enterprises. This expertise makes Event Streams ideal
                            for mission-critical workloads.
                        </p>
                        <Button onClick={startServer}>Start Producer</Button>
                    </Column>
                    <Column md={4} lg={{span: 8, offset: 7}} sm={4}>
                        <img
                            className="landing-page-bg"
                            src={`/ibm-es-landing.jpg`}
                            alt="Carbon illustration"

                        />
                    </Column>
                </Grid>
            </Column>
            <Column lg={16} md={8} sm={4} className="landing-page__r3">
                <InfoSection heading="Why IBM Event Streams" className="landing-page__r3">
                    <InfoCard
                        heading="Connectivity to enterprise systems"
                        body="With connectors to a wide range of core systems and a scalable REST API, you can extend the reach of your existing enterprise assets."
                        icon={() => <IbmCloudVpcEndpoints size={32}/>}
                    />
                    <InfoCard
                        heading="Enterprise-grade deployment and operations"
                        body="Take advantage of rich security and geo-replication for disaster recovery. Benefit from IBM's productivity tools and use the CLI to enforce best practices."
                        icon={() => <Application size={32}/>}
                    />
                    <InfoCard
                        heading="Access to 24x7 IBM Support and to event-driven architecture expertise"
                        body="Access IBM Support for deep technical expertise whenever you need it."
                        icon={() => <Globe size={32}/>}
                    />
                </InfoSection>
            </Column>
        </Grid>

    );
};

export default LandingPage;