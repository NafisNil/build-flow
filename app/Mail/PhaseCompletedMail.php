<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\PlotPhase;


class PhaseCompletedMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public PlotPhase $plotPhase;

    public function __construct(PlotPhase $plotPhase)
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Build Milestone Reached: {$this->plotPhase->phase->name} - Plot {$this->plotPhase->plot->plot_number}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.phase-completed',
            with: [
                'phaseName' => $this->plotPhase->phase->name,
                'plotNumber' => $this->plotPhase->plot->plot_number,
                'projectName' => $this->plotPhase->plot->project->name,
                'completedAt' => $this->plotPhase->completed_at?->format('d M, Y'),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
