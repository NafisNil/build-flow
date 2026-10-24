<x-mail::message>
# Build Milestone Reached!

Great news! Construction on **Plot {{ $plotNumber }}** at **{{ $projectName }}** has officially completed a major phase:

<x-mail::panel>
**Phase Passed:** {{ $phaseName }}  
**Date Completed:** {{ $completedAt }}
</x-mail::panel>

You can log in to your buyer portal anytime to view updated milestone photos and compliance documentation.

<x-mail::button :url="config('app.url') . '/my-home'">
View Buyer Portal
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>