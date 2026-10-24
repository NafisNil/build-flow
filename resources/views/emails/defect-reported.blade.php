<x-mail::message>
# New Aftercare Ticket Logged

A new snag/defect ticket has been submitted for **Plot {{ $plotNumber }}** ({{ $projectName }}).

<x-mail::panel>
**Category:** {{ $category }}  
**Title:** {{ $title }}  
**Description:** {{ $description }}
</x-mail::panel>

Please review and assign a site engineer to resolve this ticket.

<x-mail::button :url="config('app.url') . '/aftercare'">
Open Aftercare Dashboard
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>