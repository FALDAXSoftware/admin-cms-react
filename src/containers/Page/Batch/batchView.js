import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    PDFViewer
} from "@react-pdf/renderer";
import { Table } from 'antd';

const styles = StyleSheet.create({
    page: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
        backgroundColor: 'gray'
    }

});

export default function PdfDocument(props) {
    return (
        // <PDFViewer>
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'gray' }}>
                    <View style={styles.section}>
                        <Text>Transaction Hash</Text>
                        <Text>aa3d63af85</Text>
                    </View>
                    <View style={styles.section}>
                        <Text>Batch Date</Text>
                        <Text>True</Text>
                    </View>
                    <View style={styles.section}>
                        <Text>Purchases</Text>
                        <Text>True</Text>
                    </View>
                    <View style={styles.section}>
                        <Text>Withdrawals</Text>
                        <Text>true</Text>
                    </View>
                </View>
            </Page>
        </Document>
        // </PDFViewer>
    );
}