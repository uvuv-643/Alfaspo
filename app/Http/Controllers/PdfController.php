<?php

namespace App\Http\Controllers;

use Dompdf\Dompdf;
use Illuminate\Http\Request;

class PdfController extends Controller
{
    public function generatePDF(Request $request)
    {
        // Create a new Dompdf instance
        $dompdf = new Dompdf(['isRemoteEnabled' => true]);

        // Load HTML content from a blade view
        $html = view('pdf.template')->render();

        // Load HTML content into Dompdf
        $dompdf->loadHtml($html);

        // (Optional) Set paper size and orientation
        $dompdf->setPaper('A4', 'portrait');

        // Render the PDF (generates output)
        $dompdf->render();

        // Output the PDF to the browser
        return $dompdf->stream('document.pdf');

    }

    public function test() {
        return view('pdf.template');
    }

}
